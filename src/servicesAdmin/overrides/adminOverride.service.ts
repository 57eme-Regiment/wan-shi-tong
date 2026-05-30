import { Database } from '@/infrastructure/database';
import { AppError } from '@/shared/errors/appError';
import { inject, injectable } from 'tsyringe';
import { AdminOverrideRepository } from './adminOverride.repository';

/** Logique métier pour l'administration des overrides de permissions par utilisateur. */
@injectable()
export class AdminOverrideService {
  constructor(
    private readonly db: Database,
    @inject(AdminOverrideRepository)
    private readonly repo: AdminOverrideRepository,
  ) {}

  /** Retourne tous les overrides de permissions d'un utilisateur donné. */
  getByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  /**
   * Crée ou met à jour un override de permission pour un utilisateur,
   * puis invalide son snapshot d'accès.
   * @throws {AppError} 404 si la permission est introuvable.
   */
  async upsert(data: {
    userId: string;
    permissionKey: string;
    effect: 'allow' | 'deny';
    reason?: string;
  }) {
    const permission = await this.db.context.permission.findUnique({
      where: { key: data.permissionKey },
    });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const override = await this.repo.upsert({
      userId: data.userId,
      permissionId: permission.id,
      effect: data.effect,
      reason: data.reason,
    });

    await this.db.context.userAccessSnapshot.deleteMany({ where: { userId: data.userId } });

    return override;
  }

  /**
   * Supprime un override de permission et invalide le snapshot d'accès de l'utilisateur dans une transaction.
   * @throws {AppError} 404 si la permission ou l'override sont introuvables.
   */
  async delete(userId: string, permissionKey: string) {
    const permission = await this.db.context.permission.findUnique({
      where: { key: permissionKey },
    });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const existing = await this.repo.findByKey(userId, permission.id);
    if (!existing) throw new AppError('Override not found', 404, 'OVERRIDE_NOT_FOUND');

    await this.db.context.$transaction(async (tx) => {
      await tx.userPermissionOverride.delete({
        where: { userId_permissionId: { userId, permissionId: permission.id } },
      });
      await tx.userAccessSnapshot.deleteMany({ where: { userId } });
    });
  }
}
