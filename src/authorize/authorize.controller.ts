import { env } from '@/config/env';
import { Database } from '@/infrastructure/database';
import { auth } from '@/lib/auth/betterAuth';
import type { IPermissionResolverService } from '@/service/permission/permissionResolver.service.interface';
import type { Permission } from '@57eme-regiment/auth-contracts';
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthorizeController {
  constructor(
    private readonly db: Database,
    @inject('IPermissionResolverService')
    private readonly permService: IPermissionResolverService,
  ) {}

  async authorize(
    request: FastifyRequest<{ Body: { permission: Permission } }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });

    if (!session) {
      return reply.send({ allowed: false, reason: 'UNAUTHENTICATED' });
    }

    const [user, account] = await Promise.all([
      this.db.context.user.findUnique({ where: { id: session.user.id } }),
      this.db.context.account.findFirst({
        where: { userId: session.user.id, providerId: 'discord' },
        select: { accountId: true },
      }),
    ]);

    if (!user || user.disabledAt) {
      return reply.send({ allowed: false, reason: 'ACCOUNT_DISABLED' });
    }

    const { permissions } = await this.permService.resolveForUser(user.id, env.DISCORD_GUILD_ID);
    const { permission } = request.body;

    if (permissions.includes(permission)) {
      return reply.send({
        allowed: true,
        user: {
          id: user.id,
          discordUserId: account?.accountId ?? '',
          username: user.name,
        },
      });
    }

    return reply.send({
      allowed: false,
      reason: 'MISSING_PERMISSION',
      permission,
    });
  }
}
