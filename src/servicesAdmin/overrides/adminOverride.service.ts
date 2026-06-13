import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { AdminOverrideRepository } from './adminOverride.repository';

@injectable()
export class AdminOverrideService {
  constructor(
    private readonly db: Database,
    private readonly repo: AdminOverrideRepository,
  ) {}

  getByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  async upsert(data: {
    userId: string;
    permissionKey: string;
    effect: 'allow' | 'deny';
    reason?: string;
  }) {
    const permission = await this.db.context.query.permission.findFirst({
      where: (p, { eq }) => eq(p.key, data.permissionKey),
    });
    if (!permission)
      throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const override = await this.repo.upsert({
      userId: data.userId,
      permissionId: permission.id,
      effect: data.effect,
      reason: data.reason,
    });

    await this.db.context
      .delete(schema.userAccessSnapshot)
      .where(eq(schema.userAccessSnapshot.userId, data.userId));

    return override;
  }

  async delete(userId: string, permissionKey: string) {
    const permission = await this.db.context.query.permission.findFirst({
      where: (p, { eq }) => eq(p.key, permissionKey),
    });
    if (!permission)
      throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const existing = await this.repo.findByKey(userId, permission.id);
    if (!existing)
      throw new AppError('Override not found', 404, 'OVERRIDE_NOT_FOUND');

    await this.db.context.transaction(async tx => {
      await tx
        .delete(schema.userPermissionOverride)
        .where(
          and(
            eq(schema.userPermissionOverride.userId, userId),
            eq(schema.userPermissionOverride.permissionId, permission.id),
          ),
        );
      await tx.delete(schema.userAccessSnapshot).where(eq(schema.userAccessSnapshot.userId, userId));
    });
  }
}
