import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { AdminSessionService } from './adminSession.service';

/** Contrôleur HTTP pour la gestion des sessions actives (admin). */
@injectable()
export class AdminSessionController {
  constructor(private readonly service: AdminSessionService) {}

  /** Retourne la liste de toutes les sessions actives. */
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await this.service.getAll());
  }

  /**
   * Révoque une session par son id (204 sans corps).
   * @throws {AppError} 404 si la session est introuvable.
   */
  async revoke(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply,
  ) {
    await this.service.revoke(request.params.sessionId);
    return reply.code(204).send();
  }
}
