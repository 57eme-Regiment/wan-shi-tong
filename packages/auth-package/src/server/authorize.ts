import type { AuthorizeBody, AuthorizeResponse } from '@57eme-regiment/auth-package';
import { authorizeContract, AuthorizeResponseSchema } from '@57eme-regiment/auth-package';

export async function authorizeRequest(params: {
  authServiceUrl: string;
  cookie?: string;
  permission: AuthorizeBody['permission'];
}): Promise<AuthorizeResponse> {
  const res = await fetch(
    `${params.authServiceUrl}${authorizeContract.check.path}`,
    {
      method: authorizeContract.check.method,
      headers: {
        'content-type': 'application/json',
        cookie: params.cookie ?? '',
      },
      body: JSON.stringify({ permission: params.permission }),
    },
  );

  if (!res.ok) {
    return { allowed: false, reason: 'UNAUTHENTICATED' };
  }

  return AuthorizeResponseSchema.parse(await res.json());
}
