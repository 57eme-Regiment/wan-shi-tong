import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { AdminOverrideService } from './adminOverride.service';

/** Contrôleur HTTP pour la gestion des overrides de permissions par utilisateur (admin). */
@injectable()
export class AdminOverrideController {
  constructor(private readonly service: AdminOverrideService) {}

  /** Retourne tous les overrides de permissions associés à un utilisateur. */
  async getByUser(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    return reply.send(await this.service.getByUser(request.params.userId));
  }

  /** Crée ou met à jour un override de permission pour un utilisateur (201). */
  async upsert(
    request: FastifyRequest<{
      Params: { userId: string };
      Body: {
        permissionKey: string;
        effect: 'allow' | 'deny';
        reason?: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    return reply.code(201).send(
      await this.service.upsert({
        userId: request.params.userId,
        ...request.body,
      }),
    );
  }

  /**
   * Supprime l'override d'une permission pour un utilisateur (204 sans corps).
   * @throws {AppError} 404 si l'override est introuvable.
   */
  async delete(
    request: FastifyRequest<{
      Params: { userId: string; permissionKey: string };
    }>,
    reply: FastifyReply,
  ) {
    await this.service.delete(
      request.params.userId,
      request.params.permissionKey,
    );
    return reply.code(204).send();
  }
}
