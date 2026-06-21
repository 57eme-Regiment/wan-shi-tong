import { container } from '@/infrastructure/container';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { adminDiscordMappingContract } from '@57eme-regiment/auth-package';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { AdminDiscordMappingController } from './adminDiscordMapping.controller';

export async function adminDiscordMappingRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminDiscordMappingController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, adminDiscordMappingContract.getMappings, ctrl.getAll.bind(ctrl));
  declareRoute(server, adminDiscordMappingContract.createMapping, ctrl.create.bind(ctrl));
  declareRoute(server, adminDiscordMappingContract.deleteMapping, ctrl.delete.bind(ctrl));
}
