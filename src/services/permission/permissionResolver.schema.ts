import { z } from 'zod';

/** Schéma Zod décrivant les données brutes de permissions d'un utilisateur chargées depuis la base. */
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

/** Données brutes de permissions d'un utilisateur, inférées depuis `UserPermissionDataSchema`. */
export type UserPermissionData = z.infer<typeof UserPermissionDataSchema>;

/** Schéma Zod décrivant un snapshot de permissions calculé et mis en cache. */
export const SnapshotDataSchema = z.object({
  appRoles: z.string().array(),
  discordRoles: z.string().array(),
  permissions: z.string().array(),
  computedAt: z.date(),
});

/** Snapshot de permissions mis en cache, inféré depuis `SnapshotDataSchema`. */
export type SnapshotData = z.infer<typeof SnapshotDataSchema>;
