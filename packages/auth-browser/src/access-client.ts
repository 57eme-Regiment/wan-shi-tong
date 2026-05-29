import type { MyAccess, Permission } from "@57eme-regiment/auth-contracts";

export function createAccessClient(baseUrl: string) {
  async function getMyAccess(): Promise<MyAccess | null> {
    const res = await fetch(`${baseUrl}/access/me`, {
      credentials: "include",
    });

    if (!res.ok) return null;

    return res.json() as Promise<MyAccess>;
  }

  function hasPermission(
    access: MyAccess | null,
    permission: Permission,
  ): boolean {
    return access?.permissions.includes(permission) ?? false;
  }

  return { getMyAccess, hasPermission };
}

export type AccessClient = ReturnType<typeof createAccessClient>;
