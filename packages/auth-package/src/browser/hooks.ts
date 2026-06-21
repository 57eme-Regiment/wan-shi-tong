import type { AccessMeResponse, Permission } from '@57eme-regiment/auth-package';
import { useEffect, useState } from 'react';
import { getConfig } from './config';

export function useAccess(): {
  access: AccessMeResponse | null;
  loading: boolean;
} {
  const [access, setAccess] = useState<AccessMeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig()
      .accessClient.getMyAccess()
      .then(setAccess)
      .finally(() => setLoading(false));
  }, []);

  return { access, loading };
}

export function useHasPermission(permission?: Permission | null): boolean {
  if (!permission) return true;
  const { access } = useAccess();
  if (access?.user.isSuperAdmin) return true;
  return getConfig().accessClient.hasPermission(access, permission);
}
