import { useState, useEffect } from "react";
import type { MyAccess, Permission } from "@57eme-regiment/auth-contracts";
import { createAccessClient } from "./access-client";

export function createAuthHooks(baseUrl: string) {
  const client = createAccessClient(baseUrl);

  function useAccess(): { access: MyAccess | null; loading: boolean } {
    const [access, setAccess] = useState<MyAccess | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      client
        .getMyAccess()
        .then(setAccess)
        .finally(() => setLoading(false));
    }, []);

    return { access, loading };
  }

  function useHasPermission(permission: Permission): boolean {
    const { access } = useAccess();
    return client.hasPermission(access, permission);
  }

  return { useAccess, useHasPermission };
}
