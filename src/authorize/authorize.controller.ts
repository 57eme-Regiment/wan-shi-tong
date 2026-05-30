import { env } from '@/config/env';
import { Database } from '@/infrastructure/database';
import { auth } from '@/lib/auth/betterAuth';
import { PermissionResolverService } from '@/services/permission/permissionResolver.service';
import type { Permission } from '@57eme-regiment/auth-contracts';
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

/** Contrôleur HTTP pour la vérification de permission d'un utilisateur authentifié. */
@injectable()
export class AuthorizeController {
  constructor(
    private readonly db: Database,
    private readonly permService: PermissionResolverService,
  ) {}

  /**
   * Vérifie si l'utilisateur courant possède la permission demandée dans le corps de la requête.
   * Retourne toujours 200 avec `{ allowed: boolean }` — les erreurs métier sont encodées dans la réponse.
   */
  async authorize(
    request: FastifyRequest<{ Body: { permission: Permission } }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

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

    const { permissions } = await this.permService.resolveForUser(
      user.id,
      env.DISCORD_GUILD_ID,
    );
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
