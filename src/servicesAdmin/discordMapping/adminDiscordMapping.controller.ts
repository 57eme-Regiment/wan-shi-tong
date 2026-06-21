import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { AdminDiscordMappingService } from './adminDiscordMapping.service';

/** Contrôleur HTTP pour la gestion des mappings Discord ↔ rôles applicatifs (admin). */
@injectable()
export class AdminDiscordMappingController {
  constructor(private readonly service: AdminDiscordMappingService) {}

  /** Retourne la liste de tous les mappings Discord existants. */
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await this.service.getAll());
  }

  /** Crée un mapping entre un rôle Discord et un rôle applicatif, et retourne la ressource créée (201). */
  async create(
    request: FastifyRequest<{
      Body: { guildId: string; discordRoleId: string; roleKey: string };
    }>,
    reply: FastifyReply,
  ) {
    return reply.code(201).send(await this.service.create(request.body));
  }

  /**
   * Supprime un mapping Discord par son id (204 sans corps).
   * @throws {AppError} 404 si le mapping est introuvable.
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await this.service.delete(request.params.id);
    return reply.code(204).send();
  }
}
