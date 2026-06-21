import { container } from '@/infrastructure/container';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { adminUsersContract } from '@57eme-regiment/auth-package';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AdminUserController } from './adminUser.controller';

export async function adminUserRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminUserController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, adminUsersContract.search, ctrl.search.bind(ctrl));
  declareRoute(server, adminUsersContract.getAll, ctrl.getAll.bind(ctrl));
  declareRoute(server, adminUsersContract.disableUser, ctrl.disable.bind(ctrl));
  declareRoute(server, adminUsersContract.enableUser, ctrl.enable.bind(ctrl));
  declareRoute(server, adminUsersContract.setSuperAdmin, ctrl.setSuperAdmin.bind(ctrl));
  declareRoute(server, adminUsersContract.syncDiscord, ctrl.syncDiscord.bind(ctrl));
}
