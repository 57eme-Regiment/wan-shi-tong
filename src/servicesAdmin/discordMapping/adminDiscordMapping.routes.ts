import { container } from '@/infrastructure/container';
import {
  AdminDiscordMappingSchema,
  AdminErrorSchema,
  CreateDiscordMappingSchema,
  MappingParamsSchema,
} from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminDiscordMappingController } from './adminDiscordMapping.controller';

/**
 * Enregistre les routes de gestion des correspondances Discord sous le préfixe /api/admin/discord-mappings.
 * Ces mappings associent des rôles Discord à des rôles internes de l'application.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function adminDiscordMappingRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminDiscordMappingController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne la liste de tous les mappings Discord existants. */
  server.get('/', {
    schema: { response: { 200: z.array(AdminDiscordMappingSchema), 401: AdminErrorSchema, 403: AdminErrorSchema } },
  }, ctrl.getAll.bind(ctrl));

  /** Crée un nouveau mapping entre un rôle Discord et un rôle interne. */
  server.post('/', {
    schema: {
      body: CreateDiscordMappingSchema,
      response: { 201: AdminDiscordMappingSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.create.bind(ctrl));

  /** Supprime un mapping Discord identifié par son id. */
  server.delete('/:id', {
    schema: {
      params: MappingParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.delete.bind(ctrl));
}
