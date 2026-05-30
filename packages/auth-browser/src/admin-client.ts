import { adminContract } from "@57eme-regiment/auth-contracts";
import type {
  AdminDiscordMapping,
  AdminOverride,
  AdminPermission,
  AdminRole,
  AdminSession,
  CreateDiscordMapping,
  CreateOverride,
  CreateRole,
  UpdateRole,
} from "@57eme-regiment/auth-contracts";

type FetchOptions = { credentials?: RequestCredentials };

export function createAdminClient(baseUrl: string, options: FetchOptions = { credentials: "include" }) {
  async function req<T>(
    path: string,
    method: string,
    body?: unknown,
  ): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      credentials: options.credentials,
      headers: body !== undefined ? { "content-type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  return {
    // Roles
    getRoles: () =>
      req<AdminRole[]>(adminContract.getRoles.path, adminContract.getRoles.method),
    createRole: (body: CreateRole) =>
      req<AdminRole>(adminContract.createRole.path, adminContract.createRole.method, body),
    updateRole: (id: string, body: UpdateRole) =>
      req<AdminRole>(adminContract.updateRole.path.replace(':id', id), adminContract.updateRole.method, body),
    deleteRole: (id: string) =>
      req<void>(adminContract.deleteRole.path.replace(':id', id), adminContract.deleteRole.method),

    // Permissions
    getPermissions: () =>
      req<AdminPermission[]>(adminContract.getPermissions.path, adminContract.getPermissions.method),

    // Discord mappings
    getMappings: () =>
      req<AdminDiscordMapping[]>(adminContract.getMappings.path, adminContract.getMappings.method),
    createMapping: (body: CreateDiscordMapping) =>
      req<AdminDiscordMapping>(adminContract.createMapping.path, adminContract.createMapping.method, body),
    deleteMapping: (id: string) =>
      req<void>(adminContract.deleteMapping.path.replace(':id', id), adminContract.deleteMapping.method),

    // Overrides
    getOverrides: (userId: string) =>
      req<AdminOverride[]>(adminContract.getOverrides.path.replace(':userId', userId), adminContract.getOverrides.method),
    upsertOverride: (userId: string, body: CreateOverride) =>
      req<AdminOverride>(adminContract.upsertOverride.path.replace(':userId', userId), adminContract.upsertOverride.method, body),
    deleteOverride: (userId: string, permissionKey: string) =>
      req<void>(adminContract.deleteOverride.path.replace(':userId', userId).replace(':permissionKey', permissionKey), adminContract.deleteOverride.method),

    // Users
    disableUser: (userId: string, reason?: string) =>
      req<void>(adminContract.disableUser.path.replace(':userId', userId), adminContract.disableUser.method, { reason }),
    enableUser: (userId: string) =>
      req<void>(adminContract.enableUser.path.replace(':userId', userId), adminContract.enableUser.method),
    syncDiscord: (userId: string) =>
      req<void>(adminContract.syncDiscord.path.replace(':userId', userId), adminContract.syncDiscord.method),

    // Sessions
    getSessions: () =>
      req<AdminSession[]>(adminContract.getSessions.path, adminContract.getSessions.method),
    revokeSession: (sessionId: string) =>
      req<void>(adminContract.revokeSession.path.replace(':sessionId', sessionId), adminContract.revokeSession.method),
  };
}

export type AdminClient = ReturnType<typeof createAdminClient>;
