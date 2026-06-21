import type { AuthorizedUser, Permission } from '@57eme-regiment/auth-package';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { authorizeRequest } from './authorize';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthorizedUser;
  }
}

export function requirePermission(permission: Permission) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const result = await authorizeRequest({
      authServiceUrl: process.env['WANSHITONG_SERVICE_URL']!,
      cookie: request.headers.cookie,
      permission,
    });

    if (!result.allowed) {
      if (result.reason === 'UNAUTHENTICATED') {
        return reply.code(401).send({
          code: 'UNAUTHENTICATED',
          message: 'Authentication required',
        });
      }

      if (result.reason === 'ACCOUNT_DISABLED') {
        return reply.code(403).send({
          code: 'ACCOUNT_DISABLED',
          message: 'Account has been disabled',
        });
      }

      return reply.code(403).send({
        code: 'FORBIDDEN',
        message: 'Missing permission',
        permission,
      });
    }

    request.user = result.user;
  };
}
