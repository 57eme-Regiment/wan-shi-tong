import { Database } from '@/infrastructure/database';
import { AppError } from '@/shared/errors/appError';
import { injectable } from 'tsyringe';
import { AdminDiscordMappingRepository } from './adminDiscordMapping.repository';

/** Logique métier pour l'administration des mappings entre rôles Discord et rôles applicatifs. */
@injectable()
export class AdminDiscordMappingService {
  constructor(
    private readonly db: Database,
    private readonly repo: AdminDiscordMappingRepository,
  ) {}

  /** Retourne tous les mappings Discord existants. */
  getAll() {
    return this.repo.findAll();
  }

  /**
   * Crée un mapping entre un rôle Discord et un rôle applicatif,
   * puis invalide les snapshots des utilisateurs concernés.
   * @throws {AppError} 404 si le rôle applicatif correspondant à la clé est introuvable.
   */
  async create(data: {
    guildId: string;
    discordRoleId: string;
    roleKey: string;
  }) {
    const role = await this.db.context.role.findUnique({
      where: { key: data.roleKey },
    });
    if (!role) throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');

    const mapping = await this.repo.create({
      guildId: data.guildId,
      discordRoleId: data.discordRoleId,
      roleId: role.id,
    });

    // Invalide les snapshots des utilisateurs ayant ce rôle Discord dans ce serveur
    const affected = await this.db.context.discordUserRole.findMany({
      where: { guildId: data.guildId, discordRoleId: data.discordRoleId },
      select: { userId: true },
    });

    if (affected.length > 0) {
      await this.db.context.userAccessSnapshot.deleteMany({
        where: { userId: { in: affected.map(u => u.userId) } },
      });
    }

    return mapping;
  }

  /**
   * Supprime un mapping et invalide les snapshots des utilisateurs concernés dans une transaction.
   * @throws {AppError} 404 si le mapping est introuvable.
   */
  async delete(id: string) {
    const mapping = await this.repo.findById(id);
    if (!mapping)
      throw new AppError('Mapping not found', 404, 'MAPPING_NOT_FOUND');

    const affected = await this.db.context.discordUserRole.findMany({
      where: { guildId: mapping.guildId, discordRoleId: mapping.discordRoleId },
      select: { userId: true },
    });

    await this.db.context.$transaction(async tx => {
      await tx.discordRoleMapping.delete({ where: { id } });
      if (affected.length > 0) {
        await tx.userAccessSnapshot.deleteMany({
          where: { userId: { in: affected.map(u => u.userId) } },
        });
      }
    });
  }
}
