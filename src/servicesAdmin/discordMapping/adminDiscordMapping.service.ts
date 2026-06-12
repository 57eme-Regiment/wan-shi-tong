import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { and, eq, inArray } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { AdminDiscordMappingRepository } from './adminDiscordMapping.repository';

@injectable()
export class AdminDiscordMappingService {
  constructor(
    private readonly db: Database,
    private readonly repo: AdminDiscordMappingRepository,
  ) {}

  getAll() {
    return this.repo.findAll();
  }

  async create(data: { guildId: string; discordRoleId: string; roleKey: string }) {
    const role = await this.db.context.query.role.findFirst({
      where: (r, { eq }) => eq(r.key, data.roleKey),
    });
    if (!role) throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');

    const mapping = await this.repo.create({
      guildId: data.guildId,
      discordRoleId: data.discordRoleId,
      roleId: role.id,
    });

    const affected = await this.db.context.query.discordUserRole.findMany({
      where: (r, { and, eq }) =>
        and(eq(r.guildId, data.guildId), eq(r.discordRoleId, data.discordRoleId)),
      columns: { userId: true },
    });

    if (affected.length > 0) {
      await this.db.context
        .delete(schema.userAccessSnapshot)
        .where(inArray(schema.userAccessSnapshot.userId, affected.map(u => u.userId)));
    }

    return mapping;
  }

  async delete(id: string) {
    const mapping = await this.repo.findById(id);
    if (!mapping) throw new AppError('Mapping not found', 404, 'MAPPING_NOT_FOUND');

    const affected = await this.db.context.query.discordUserRole.findMany({
      where: (r, { and, eq }) =>
        and(eq(r.guildId, mapping.guildId), eq(r.discordRoleId, mapping.discordRoleId)),
      columns: { userId: true },
    });

    await this.db.context.transaction(async tx => {
      await tx.delete(schema.discordRoleMapping).where(eq(schema.discordRoleMapping.id, id));
      if (affected.length > 0) {
        await tx
          .delete(schema.userAccessSnapshot)
          .where(inArray(schema.userAccessSnapshot.userId, affected.map(u => u.userId)));
      }
    });
  }
}
