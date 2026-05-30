import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { AdminGuard } from '../adminGuard';
import { AdminPermissionService } from './adminPermission.service';

/** Contrôleur HTTP pour la consultation des permissions applicatives (admin). */
@injectable()
export class AdminPermissionController {
  constructor(
    @inject(AdminGuard) private readonly guard: AdminGuard,
    @inject(AdminPermissionService) private readonly service: AdminPermissionService,
  ) {}

  /** Retourne la liste de toutes les permissions applicatives. */
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    await this.guard.authorize(request, PERMISSIONS.ADMIN_PERMISSIONS_READ);
    return reply.send(await this.service.getAll());
  }
}
