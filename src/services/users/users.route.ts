import { container } from '@/infrastructure/container';
import { declareRoute } from '@/shared/utils/declareRoute';
import { contract } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';

export async function UsersRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(UsersController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, contract.users.getById, ctrl.getById.bind(ctrl));
}
