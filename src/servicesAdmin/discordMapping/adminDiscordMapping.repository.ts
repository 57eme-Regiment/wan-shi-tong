import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class AdminDiscordMappingRepository {
  constructor(private readonly db: Database) {}

  findAll() {
    return this.db.context.query.discordRoleMapping.findMany({
      orderBy: (m, { asc }) => [asc(m.guildId)],
      with: {
        role: { columns: { key: true, name: true } },
      },
    });
  }

  findById(id: string) {
    return this.db.context.query.discordRoleMapping.findFirst({
      where: (m, { eq }) => eq(m.id, id),
    });
  }

  async create(data: { guildId: string; discordRoleId: string; roleId: string }) {
    const [created] = await this.db.context
      .insert(schema.discordRoleMapping)
      .values(data)
      .returning();

    return this.db.context.query.discordRoleMapping.findFirst({
      where: (m, { eq }) => eq(m.id, created.id),
      with: {
        role: { columns: { key: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    await this.db.context
      .delete(schema.discordRoleMapping)
      .where(eq(schema.discordRoleMapping.id, id));
  }
}
