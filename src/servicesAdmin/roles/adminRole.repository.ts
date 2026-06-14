import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class AdminRoleRepository {
  constructor(private readonly db: Database) {}

  findAll() {
    return this.db.context.query.role.findMany({
      orderBy: (r, { asc }) => [asc(r.createdAt)],
    });
  }

  findById(id: string) {
    return this.db.context.query.role.findFirst({
      where: (r, { eq }) => eq(r.id, id),
    });
  }

  async create(data: { key: string; name: string; description?: string }) {
    const [created] = await this.db.context
      .insert(schema.role)
      .values(data)
      .returning();
    return created;
  }

  async update(id: string, data: { key?: string; name?: string; description?: string | null }) {
    const [updated] = await this.db.context
      .update(schema.role)
      .set(data)
      .where(eq(schema.role.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await this.db.context.delete(schema.role).where(eq(schema.role.id, id));
  }
}
