import { adminContract } from '@57eme-regiment/auth-package';
import type {
  AddRolePermission,
  AdminDiscordMapping,
  AdminOverride,
  AdminPermission,
  AdminRole,
  AdminSession,
  AdminUser,
  CreateDiscordMapping,
  CreateOverride,
  CreatePermission,
  CreateRole,
  RolePermissionItem,
  UpdatePermission,
  UpdateRole,
} from '@57eme-regiment/auth-package';

type FetchOptions = { credentials?: RequestCredentials };

export function createAdminClient(baseUrl: string, options: FetchOptions = { credentials: 'include' }) {
  async function req<T>(path: string, method: string, body?: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      credentials: options.credentials,
      headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  const r = adminContract;

  return {
    getRoles: () =>
      req<AdminRole[]>(r.adminRole.getRoles.path, r.adminRole.getRoles.method),
    createRole: (body: CreateRole) =>
      req<AdminRole>(r.adminRole.createRole.path, r.adminRole.createRole.method, body),
    updateRole: (id: string, body: UpdateRole) =>
      req<AdminRole>(r.adminRole.updateRole.path.replace(':id', id), r.adminRole.updateRole.method, body),
    deleteRole: (id: string) =>
      req<void>(r.adminRole.deleteRole.path.replace(':id', id), r.adminRole.deleteRole.method),

    getRolePermissions: (roleId: string) =>
      req<RolePermissionItem[]>(r.adminRole.getRolePermissions.path.replace(':roleId', roleId), r.adminRole.getRolePermissions.method),
    addRolePermission: (roleId: string, body: AddRolePermission) =>
      req<RolePermissionItem>(r.adminRole.addRolePermission.path.replace(':roleId', roleId), r.adminRole.addRolePermission.method, body),
    removeRolePermission: (roleId: string, permissionId: string) =>
      req<void>(r.adminRole.removeRolePermission.path.replace(':roleId', roleId).replace(':permissionId', permissionId), r.adminRole.removeRolePermission.method),

    getPermissions: () =>
      req<AdminPermission[]>(r.adminPermisisions.getPermissions.path, r.adminPermisisions.getPermissions.method),
    createPermission: (body: CreatePermission) =>
      req<AdminPermission>(r.adminPermisisions.createPermissions.path, r.adminPermisisions.createPermissions.method, body),
    updatePermission: (id: string, body: UpdatePermission) =>
      req<AdminPermission>(r.adminPermisisions.updatePermission.path.replace(':id', id), r.adminPermisisions.updatePermission.method, body),
    deletePermission: (id: string) =>
      req<void>(r.adminPermisisions.deletePermissions.path.replace(':id', id), r.adminPermisisions.deletePermissions.method),

    getMappings: () =>
      req<AdminDiscordMapping[]>(r.adminDiscordMapping.getMappings.path, r.adminDiscordMapping.getMappings.method),
    createMapping: (body: CreateDiscordMapping) =>
      req<AdminDiscordMapping>(r.adminDiscordMapping.createMapping.path, r.adminDiscordMapping.createMapping.method, body),
    deleteMapping: (id: string) =>
      req<void>(r.adminDiscordMapping.deleteMapping.path.replace(':id', id), r.adminDiscordMapping.deleteMapping.method),

    getOverrides: (userId: string) =>
      req<AdminOverride[]>(r.adminOverrides.getOverrides.path.replace(':userId', userId), r.adminOverrides.getOverrides.method),
    upsertOverride: (userId: string, body: CreateOverride) =>
      req<AdminOverride>(r.adminOverrides.upsertOverride.path.replace(':userId', userId), r.adminOverrides.upsertOverride.method, body),
    deleteOverride: (userId: string, permissionKey: string) =>
      req<void>(r.adminOverrides.deleteOverride.path.replace(':userId', userId).replace(':permissionKey', permissionKey), r.adminOverrides.deleteOverride.method),

    getAllUsers: () =>
      req<AdminUser[]>(r.adminUsers.getAll.path, r.adminUsers.getAll.method),
    disableUser: (userId: string, reason?: string) =>
      req<void>(r.adminUsers.disableUser.path.replace(':userId', userId), r.adminUsers.disableUser.method, { reason }),
    enableUser: (userId: string) =>
      req<void>(r.adminUsers.enableUser.path.replace(':userId', userId), r.adminUsers.enableUser.method),
    setSuperAdmin: (userId: string, value: boolean) =>
      req<void>(r.adminUsers.setSuperAdmin.path.replace(':userId', userId), r.adminUsers.setSuperAdmin.method, { value }),
    syncDiscord: (userId: string) =>
      req<void>(r.adminUsers.syncDiscord.path.replace(':userId', userId), r.adminUsers.syncDiscord.method),

    getSessions: () =>
      req<AdminSession[]>(r.adminSessions.getSessions.path, r.adminSessions.getSessions.method),
    revokeSession: (sessionId: string) =>
      req<void>(r.adminSessions.revokeSession.path.replace(':sessionId', sessionId), r.adminSessions.revokeSession.method),
  };
}

export type AdminClient = ReturnType<typeof createAdminClient>;
