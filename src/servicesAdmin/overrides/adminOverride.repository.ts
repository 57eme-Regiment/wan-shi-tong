import { OverrideEffect } from '@/generated/enums';
import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';

/** Accès aux données Prisma pour le modèle UserPermissionOverride (administration). */
@injectable()
export class AdminOverrideRepository {
  constructor(private readonly db: Database) {}

  /** Retourne tous les overrides de permissions d'un utilisateur, avec la clé de permission associée. */
  findByUser(userId: string) {
    return this.db.context.userPermissionOverride.findMany({
      where: { userId },
      include: { permission: { select: { key: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Retourne l'override d'une permission spécifique pour un utilisateur, ou `null` s'il n'existe pas. */
  findByKey(userId: string, permissionId: string) {
    return this.db.context.userPermissionOverride.findUnique({
      where: { userId_permissionId: { userId, permissionId } },
    });
  }

  /**
   * Crée ou met à jour l'override d'une permission pour un utilisateur.
   * Retourne l'override avec la clé de permission associée.
   */
  upsert(data: { userId: string; permissionId: string; effect: 'allow' | 'deny'; reason?: string }) {
    return this.db.context.userPermissionOverride.upsert({
      where: { userId_permissionId: { userId: data.userId, permissionId: data.permissionId } },
      update: { effect: data.effect as OverrideEffect, reason: data.reason ?? null },
      create: {
        userId: data.userId,
        permissionId: data.permissionId,
        effect: data.effect as OverrideEffect,
        reason: data.reason ?? null,
      },
      include: { permission: { select: { key: true } } },
    });
  }

  /** Supprime l'override d'une permission pour un utilisateur donné. */
  delete(userId: string, permissionId: string) {
    return this.db.context.userPermissionOverride.delete({
      where: { userId_permissionId: { userId, permissionId } },
    });
  }
}
