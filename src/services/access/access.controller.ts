import { env } from '@/config/env';
import { Database } from '@/infrastructure/database';
import { auth } from '@/lib/auth/betterAuth';
import { PermissionResolverService } from '@/services/permission/permissionResolver.service';
import { assertEnabled, findUserOrThrow } from '@/shared/helpers/userHelper';
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

/** Contrôleur HTTP pour les informations du compte courant. */
@injectable()
export class AccessController {
  constructor(
    private readonly db: Database,
    private readonly permService: PermissionResolverService,
  ) {}

  /**
   * Retourne le profil, les rôles et les permissions de l'utilisateur authentifié.
   * @throws {AppError} 401 si la session est absente, 403 si le compte est désactivé.
   */
  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.code(401).send({ code: 'UNAUTHENTICATED' });
    }

    const [user, account] = await Promise.all([
      findUserOrThrow(this.db, session.user.id),
      this.db.context.query.account.findFirst({
        where: (a, { and, eq }) =>
          and(eq(a.userId, session.user.id), eq(a.providerId, 'discord')),
        columns: { accountId: true },
      }),
    ]);

    assertEnabled(user);

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
        isSuperAdmin: user.isSuperAdmin ?? false,
      },
      appRoles,
      permissions,
    });
  }
}
