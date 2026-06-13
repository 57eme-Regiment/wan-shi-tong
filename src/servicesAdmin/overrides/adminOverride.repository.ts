import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class AdminOverrideRepository {
  constructor(private readonly db: Database) {}

  findByUser(userId: string) {
    return this.db.context.query.userPermissionOverride.findMany({
      where: (o, { eq }) => eq(o.userId, userId),
      orderBy: (o, { asc }) => [asc(o.createdAt)],
      with: {
        permission: { columns: { key: true } },
      },
    });
  }

  findByKey(userId: string, permissionId: string) {
    return this.db.context.query.userPermissionOverride.findFirst({
      where: (o, { and, eq }) =>
        and(eq(o.userId, userId), eq(o.permissionId, permissionId)),
    });
  }

  async upsert(data: { userId: string; permissionId: string; effect: 'allow' | 'deny'; reason?: string }) {
    const [result] = await this.db.context
      .insert(schema.userPermissionOverride)
      .values({
        userId: data.userId,
        permissionId: data.permissionId,
        effect: data.effect,
        reason: data.reason ?? null,
      })
      .onConflictDoUpdate({
        target: [schema.userPermissionOverride.userId, schema.userPermissionOverride.permissionId],
        set: { effect: data.effect, reason: data.reason ?? null },
      })
      .returning();

    return this.db.context.query.userPermissionOverride.findFirst({
      where: (o, { eq }) => eq(o.id, result.id),
      with: {
        permission: { columns: { key: true } },
      },
    });
  }

  async delete(userId: string, permissionId: string) {
    await this.db.context
      .delete(schema.userPermissionOverride)
      .where(
        and(
          eq(schema.userPermissionOverride.userId, userId),
          eq(schema.userPermissionOverride.permissionId, permissionId),
        ),
      );
  }
}
