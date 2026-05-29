import type {
  AuthorizeResponse,
  Permission,
} from '@57eme-regiment/auth-contracts';

export async function authorizeRequest(params: {
  authServiceUrl: string;
  cookie?: string;
  permission: Permission;
}): Promise<AuthorizeResponse> {
  const res = await fetch(`${params.authServiceUrl}/authorize`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: params.cookie ?? '',
    },
    body: JSON.stringify({ permission: params.permission }),
  });

  if (!res.ok) {
    return { allowed: false, reason: 'UNAUTHENTICATED' };
  }

  return res.json() as Promise<AuthorizeResponse>;
}
