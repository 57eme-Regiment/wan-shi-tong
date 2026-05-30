import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';

/** Accès aux données Prisma pour le modèle DiscordRoleMapping (administration). */
@injectable()
export class AdminDiscordMappingRepository {
  constructor(private readonly db: Database) {}

  /** Retourne tous les mappings Discord triés par guildId, avec la clé et le nom du rôle applicatif associé. */
  findAll() {
    return this.db.context.discordRoleMapping.findMany({
      include: { role: { select: { key: true, name: true } } },
      orderBy: { guildId: 'asc' },
    });
  }

  /** Retourne un mapping Discord par son id, ou `null` s'il est introuvable. */
  findById(id: string) {
    return this.db.context.discordRoleMapping.findUnique({ where: { id } });
  }

  /**
   * Crée un nouveau mapping entre un rôle Discord et un rôle applicatif.
   * Retourne le mapping créé avec la clé et le nom du rôle associé.
   */
  create(data: { guildId: string; discordRoleId: string; roleId: string }) {
    return this.db.context.discordRoleMapping.create({
      data,
      include: { role: { select: { key: true, name: true } } },
    });
  }

  /** Supprime le mapping Discord identifié par son id. */
  delete(id: string) {
    return this.db.context.discordRoleMapping.delete({ where: { id } });
  }
}
