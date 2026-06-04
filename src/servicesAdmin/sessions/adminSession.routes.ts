import { container } from '@/infrastructure/container';
import { declareRoute } from '@/shared/utils/declareRoute';
import { adminSessionsContract } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AdminSessionController } from './adminSession.controller';

export async function adminSessionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminSessionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, adminSessionsContract.getSessions, ctrl.getAll.bind(ctrl));
  declareRoute(server, adminSessionsContract.revokeSession, ctrl.revoke.bind(ctrl));
}
