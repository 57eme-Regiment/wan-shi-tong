import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { AdminGuard } from '../adminGuard';
import { AdminRoleService } from './adminRole.service';

/** Contrôleur HTTP pour la gestion des rôles applicatifs (admin). */
@injectable()
export class AdminRoleController {
  constructor(
    @inject(AdminGuard) private readonly guard: AdminGuard,
    @inject(AdminRoleService) private readonly service: AdminRoleService,
  ) {}

  /** Retourne la liste de tous les rôles applicatifs. */
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_ROLES_READ);
    return reply.send(await this.service.getAll());
  }

  /** Crée un nouveau rôle applicatif et retourne la ressource créée (201). */
  async create(
    request: FastifyRequest<{ Body: { key: string; name: string; description?: string } }>,
    reply: FastifyReply,
  ) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_ROLES_MANAGE);
    return reply.code(201).send(await this.service.create(request.body));
  }

  /**
   * Met à jour les champs d'un rôle existant.
   * @throws {AppError} 404 si le rôle est introuvable.
   */
  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: { key?: string; name?: string; description?: string | null } }>,
    reply: FastifyReply,
  ) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_ROLES_MANAGE);
    return reply.send(await this.service.update(request.params.id, request.body));
  }

  /**
   * Supprime un rôle applicatif (204 sans corps).
   * @throws {AppError} 404 si le rôle est introuvable.
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_ROLES_MANAGE);
    await this.service.delete(request.params.id);
    return reply.code(204).send();
  }
}
