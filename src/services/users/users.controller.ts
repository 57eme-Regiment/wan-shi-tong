import { UserParams } from '@57eme-regiment/auth-contracts/schemas/user.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { UsersService } from './users.service';

/** Contrôleur HTTP pour les opérations CRUD sur les inventaires. */
@injectable()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retourne un inventaire par son id.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  async getById(
    req: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) {
    const inventory = await this.usersService.getById(req.params.userId);
    return reply.send(inventory);
  }
}
