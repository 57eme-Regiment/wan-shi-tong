import { env } from '@/config/env';
import { UserQuery } from '@57eme-regiment/auth-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { AdminUserService } from './adminUser.service';

/** Contrôleur HTTP pour la gestion administrative des comptes utilisateurs. */
@injectable()
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  /** Recherche des utilisateurs par nom ou accountId. */
  async search(
    request: FastifyRequest<{ Querystring: UserQuery }>,
    reply: FastifyReply,
  ) {
    return reply.send(await this.service.search(request.query));
  }

  /** Retourne la liste de tous les utilisateurs avec leurs sessions actives. */
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await this.service.getAll());
  }

  /**
   * Désactive le compte d'un utilisateur (204 sans corps).
   * @throws {AppError} 404 si l'utilisateur est introuvable.
   */
  async disable(
    request: FastifyRequest<{
      Params: { userId: string };
      Body: { reason?: string };
    }>,
    reply: FastifyReply,
  ) {
    await this.service.disable(
      request.params.userId,
      request.body.reason ?? 'Disabled by admin',
    );
    return reply.code(204).send();
  }

  /**
   * Réactive le compte d'un utilisateur désactivé (204 sans corps).
   * @throws {AppError} 404 si l'utilisateur est introuvable, 409 s'il n'est pas désactivé.
   */
  async enable(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    await this.service.enable(request.params.userId);
    return reply.code(204).send();
  }

  /**
   * Active ou désactive le statut super admin d'un utilisateur (204 sans corps).
   * @throws {AppError} 404 si l'utilisateur est introuvable.
   */
  async setSuperAdmin(
    request: FastifyRequest<{
      Params: { userId: string };
      Body: { value: boolean };
    }>,
    reply: FastifyReply,
  ) {
    await this.service.setSuperAdmin(request.params.userId, request.body.value);
    return reply.code(204).send();
  }

  /**
   * Synchronise les rôles Discord d'un utilisateur depuis le serveur configuré (204 sans corps).
   * @throws {AppError} 404 si l'utilisateur est introuvable.
   */
  async syncDiscord(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    await this.service.syncDiscord(request.params.userId, env.DISCORD_GUILD_ID);
    return reply.code(204).send();
  }
}
