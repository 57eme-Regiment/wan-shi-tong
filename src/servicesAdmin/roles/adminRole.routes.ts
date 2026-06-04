import { container } from '@/infrastructure/container';
import { declareRoute } from '@/shared/utils/declareRoute';
import { adminRoleContract } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AdminRoleController } from './adminRole.controller';

export async function adminRoleRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminRoleController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, adminRoleContract.getRoles, ctrl.getAll.bind(ctrl));
  declareRoute(server, adminRoleContract.createRole, ctrl.create.bind(ctrl));
  declareRoute(server, adminRoleContract.updateRole, ctrl.update.bind(ctrl));
  declareRoute(server, adminRoleContract.deleteRole, ctrl.delete.bind(ctrl));
  declareRoute(server, adminRoleContract.getRolePermissions, ctrl.getPermissions.bind(ctrl));
  declareRoute(server, adminRoleContract.addRolePermission, ctrl.addPermission.bind(ctrl));
  declareRoute(server, adminRoleContract.removeRolePermission, ctrl.removePermission.bind(ctrl));
}
