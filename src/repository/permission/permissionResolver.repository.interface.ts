import { z } from 'zod';

export const UserPermissionDataSchema = z.object({
  discordRoleIds: z.string().array(),
  mappings: z
    .object({ discordRoleId: z.string(), role: z.object({ key: z.string() }) })
    .array(),
  rolePermissions: z
    .object({
      role: z.object({ key: z.string() }),
      permission: z.object({ key: z.string() }),
    })
    .array(),
  overrides: z
    .object({
      permission: z.object({ key: z.string() }),
      effect: z.enum(['allow', 'deny']),
    })
    .array(),
});

export type UserPermissionData = z.infer<typeof UserPermissionDataSchema>;

export const SnapshotDataSchema = z.object({
  appRoles: z.string().array(),
  discordRoles: z.string().array(),
  permissions: z.string().array(),
  computedAt: z.date(),
});

export type SnapshotData = z.infer<typeof SnapshotDataSchema>;

/** Contrat d'accès aux données pour la résolution des permissions. */
export interface IPermissionResolverRepository {
  /** Charge toutes les données nécessaires au calcul des permissions d'un utilisateur. */
  loadUserPermissionData(userId: string, guildId: string): Promise<UserPermissionData>;

  /** Retourne le snapshot de permissions si disponible, sinon null. */
  getSnapshot(userId: string): Promise<SnapshotData | null>;

  /** Crée ou met à jour le snapshot de permissions. */
  upsertSnapshot(
    userId: string,
    appRoles: string[],
    discordRoles: string[],
    permissions: string[],
  ): Promise<void>;
}
