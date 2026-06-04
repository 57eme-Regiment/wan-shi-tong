import { container } from '@/infrastructure/container';
import { declareRoute } from '@/shared/utils/declareRoute';
import { accessContract } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AccessController } from './access.controller';

export async function accessRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AccessController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, accessContract.me, ctrl.getMe.bind(ctrl));
}
