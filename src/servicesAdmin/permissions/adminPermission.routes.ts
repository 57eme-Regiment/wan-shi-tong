import { container } from '@/infrastructure/container';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { adminPermisisionsContract } from '@57eme-regiment/auth-package';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AdminPermissionController } from './adminPermission.controller';

export async function adminPermissionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminPermissionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, adminPermisisionsContract.getPermissions, ctrl.getAll.bind(ctrl));
  declareRoute(server, adminPermisisionsContract.createPermissions, ctrl.create.bind(ctrl));
  declareRoute(server, adminPermisisionsContract.updatePermission, ctrl.update.bind(ctrl));
  declareRoute(server, adminPermisisionsContract.deletePermissions, ctrl.delete.bind(ctrl));
}
