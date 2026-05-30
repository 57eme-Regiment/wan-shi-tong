import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { AdminGuard } from '../adminGuard';
import { AdminPermissionService } from './adminPermission.service';

/** Contrôleur HTTP pour la consultation des permissions applicatives (admin). */
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
}
