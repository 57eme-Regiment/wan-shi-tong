import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class AdminPermissionService {
  constructor(private readonly db: Database) {}

  getAll() {
    return this.db.context.query.permission.findMany({
      orderBy: (p, { asc }) => [asc(p.key)],
    });
  }

  async update(id: string, data: { key?: string; description?: string | null }) {
    const permission = await this.db.context.query.permission.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const [updated] = await this.db.context
      .update(schema.permission)
      .set(data)
      .where(eq(schema.permission.id, id))
      .returning();
    return updated;
  }

  async create(data: { key: string; description?: string }) {
    const existing = await this.db.context.query.permission.findFirst({
      where: (p, { eq }) => eq(p.key, data.key),
    });
    if (existing) throw new AppError('Permission already exists', 409, 'PERMISSION_ALREADY_EXISTS');

    const [created] = await this.db.context
      .insert(schema.permission)
      .values(data)
      .returning();
    return created;
  }

  async delete(id: string) {
    const permission = await this.db.context.query.permission.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    await this.db.context.transaction(async tx => {
      await tx.delete(schema.permission).where(eq(schema.permission.id, id));
      await tx.delete(schema.userAccessSnapshot);
    });
  }
}
