import {
  accessContract,
  AccessMeResponseSchema,
} from "@57eme-regiment/auth-contracts";
import type { AccessMeResponse, Permission } from "@57eme-regiment/auth-contracts";

export function createAccessClient(baseUrl: string) {
  async function getMyAccess(): Promise<AccessMeResponse | null> {
    const res = await fetch(`${baseUrl}${accessContract.me.path}`, {
      credentials: "include",
    });

    if (!res.ok) return null;

    return AccessMeResponseSchema.parse(await res.json());
  }

  function hasPermission(
    access: AccessMeResponse | null,
    permission: Permission,
  ): boolean {
    return access?.permissions.includes(permission) ?? false;
  }

  return { getMyAccess, hasPermission };
}

export type AccessClient = ReturnType<typeof createAccessClient>;
