import { container } from '@/infrastructure/container';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { adminOverridesContract } from '@57eme-regiment/auth-package';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AdminOverrideController } from './adminOverride.controller';

export async function adminOverrideRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminOverrideController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, adminOverridesContract.getOverrides, ctrl.getByUser.bind(ctrl));
  declareRoute(server, adminOverridesContract.upsertOverride, ctrl.upsert.bind(ctrl));
  declareRoute(server, adminOverridesContract.deleteOverride, ctrl.delete.bind(ctrl));
}
