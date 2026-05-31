import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { AdminGuard } from '../adminGuard';
import { AdminPermissionService } from './adminPermission.service';

/** Contrôleur HTTP pour la gestion des permissions applicatives (admin). */
@injectable()
export class AdminPermissionController {
  constructor(
    private readonly guard: AdminGuard,
    private readonly service: AdminPermissionService,
  ) {}

  /** Retourne la liste de toutes les permissions applicatives. */
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_PERMISSIONS_READ);
    return reply.send(await this.service.getAll());
  }

  /**
   * Met à jour une permission existante (200).
   * @throws {AppError} 404 si la permission est introuvable.
   */
  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: { key?: string; description?: string | null } }>,
    reply: FastifyReply,
  ) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_PERMISSIONS_MANAGE);
    return reply.send(await this.service.update(request.params.id, request.body));
  }

  /**
   * Crée une nouvelle permission (201).
   * @throws {AppError} 409 si la clé existe déjà.
   */
  async create(
    request: FastifyRequest<{ Body: { key: string; description?: string } }>,
    reply: FastifyReply,
  ) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_PERMISSIONS_MANAGE);
    return reply.code(201).send(await this.service.create(request.body));
  }

  /**
   * Supprime une permission par son id (204 sans corps).
   * @throws {AppError} 404 si la permission est introuvable.
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_PERMISSIONS_MANAGE);
    await this.service.delete(request.params.id);
    return reply.code(204).send();
  }
}
