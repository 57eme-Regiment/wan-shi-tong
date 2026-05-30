import { env } from '@/config/env';
import { Database } from '@/infrastructure/database';
import { auth } from '@/lib/auth/betterAuth';
import { PermissionResolverService } from '@/services/permission/permissionResolver.service';
import { AppError } from '@/shared/errors/appError';
import { assertEnabled, findUserOrThrow } from '@/shared/helpers/userHelper';
import type { Permission } from '@57eme-regiment/auth-contracts';
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

/** Garde d'accès partagé pour les routes d'administration. */
@injectable()
export class AdminGuard {
  constructor(
    private readonly db: Database,
    @inject(PermissionResolverService)
    private readonly permService: PermissionResolverService,
  ) {}

  /**
   * Vérifie la session, l'état du compte et la permission requise. Retourne le userId si autorisé.
   * @throws {AppError} 401 si la session est absente, 403 si le compte est désactivé ou la permission manquante.
   */
  async authorize(
    request: FastifyRequest,
    permission: Permission,
  ): Promise<string> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session)
      throw new AppError('Authentication required', 401, 'UNAUTHENTICATED');

    const user = await findUserOrThrow(this.db, session.user.id);
    assertEnabled(user);

    const { permissions } = await this.permService.resolveForUser(
      user.id,
      env.DISCORD_GUILD_ID,
    );
    if (!permissions.includes(permission))
      throw new AppError('Forbidden', 403, 'FORBIDDEN');

    return user.id;
  }
}
