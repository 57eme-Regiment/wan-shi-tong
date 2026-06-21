import { container } from '@/infrastructure/container';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { authorizeContract } from '@57eme-regiment/auth-package';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AuthorizeController } from './authorize.controller';

export async function authorizeRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AuthorizeController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, authorizeContract.check, ctrl.authorize.bind(ctrl));
}
