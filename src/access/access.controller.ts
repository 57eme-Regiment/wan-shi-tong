import { env } from '@/config/env';
import { Database } from '@/infrastructure/database';
import { auth } from '@/lib/auth/betterAuth';
import type { IPermissionResolverService } from '@/service/permission/permissionResolver.service.interface';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AccessController {
  constructor(
    private readonly db: Database,
    @inject('IPermissionResolverService')
    private readonly permService: IPermissionResolverService,
  ) {}

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });

    if (!session) {
      return reply.code(401).send({ code: 'UNAUTHENTICATED' });
    }

    const [user, account] = await Promise.all([
      this.db.context.user.findUnique({ where: { id: session.user.id } }),
      this.db.context.account.findFirst({
        where: { userId: session.user.id, providerId: 'discord' },
        select: { accountId: true },
      }),
    ]);

    if (!user || user.disabledAt) {
      return reply.code(403).send({ code: 'ACCOUNT_DISABLED' });
    }

    const { appRoles, permissions } = await this.permService.resolveForUser(
      user.id,
      env.DISCORD_GUILD_ID,
    );

    return reply.send({
      user: {
        id: user.id,
        discordUserId: account?.accountId ?? '',
        username: user.name,
        avatarUrl: user.image ?? undefined,
      },
      appRoles,
      permissions,
    });
  }
}
