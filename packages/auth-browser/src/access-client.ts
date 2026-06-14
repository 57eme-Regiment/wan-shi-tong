import type {
  AccessMeResponse,
  Permission,
} from '@57eme-regiment/auth-contracts';
import {
  accessContract,
  AccessMeResponseSchema,
} from '@57eme-regiment/auth-contracts';

export function createAccessClient(baseUrl: string) {
  async function getMyAccess(): Promise<AccessMeResponse | null> {
    const res = await fetch(`${baseUrl}${accessContract.me.path}`, {
      credentials: 'include',
    });

    if (!res.ok) return null;

    const parsed = AccessMeResponseSchema.safeParse(await res.json());
    if (!parsed.success) {
      console.error('[access-client] Failed to parse /access/me response:', parsed.error);
      return null;
    }
    return parsed.data;
  }

  function hasPermission(
    access: AccessMeResponse | null,
    permission: Permission | undefined,
  ): boolean {
    if (!permission) return true;
    if (access?.user.isSuperAdmin) return true;
    return access?.permissions.includes(permission) ?? false;
  }

  return { getMyAccess, hasPermission };
}

export type AccessClient = ReturnType<typeof createAccessClient>;
