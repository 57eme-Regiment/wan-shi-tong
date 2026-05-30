import type { UserPermissionData } from '@/repository/permission/permissionResolver.repository.interface';
import { z } from 'zod';

export const PermissionResolutionSchema = z.object({
  appRoles: z.string().array(),
  permissions: z.string().array(),
});

export type PermissionResolution = z.infer<typeof PermissionResolutionSchema>;

/**
 * Calcule les permissions effectives d'un utilisateur.
 * Logique pure — aucune dépendance vers la base de données.
 *
 * Règle de priorité :
 *   deny manuel > allow manuel > héritage via rôles > refus par défaut
 */
export function resolvePermissions(input: UserPermissionData): PermissionResolution {
  // 1. Rôles applicatifs déduits des rôles Discord de l'utilisateur
  const appRoles = [
    ...new Set(
      input.mappings
        .filter((m) => input.discordRoleIds.includes(m.discordRoleId))
        .map((m) => m.role.key),
    ),
  ];

  // 2. Permissions héritées via les rôles applicatifs
  const inherited = new Set(
    input.rolePermissions
      .filter((rp) => appRoles.includes(rp.role.key))
      .map((rp) => rp.permission.key),
  );

  // 3. Overrides
  const denied = new Set(
    input.overrides.filter((o) => o.effect === 'deny').map((o) => o.permission.key),
  );
  const allowed = new Set(
    input.overrides.filter((o) => o.effect === 'allow').map((o) => o.permission.key),
  );

  // 4. Permissions effectives : (héritées ∪ allow) \ deny
  const permissions = [...new Set([...inherited, ...allowed])].filter((p) => !denied.has(p));

  return { appRoles, permissions };
}
