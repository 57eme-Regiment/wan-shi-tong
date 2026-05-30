import { container } from '@/infrastructure/container';
import {
  AdminErrorSchema,
  AdminOverrideSchema,
  CreateOverrideSchema,
  OverrideDeleteParamsSchema,
  OverrideUserParamsSchema,
} from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminOverrideController } from './adminOverride.controller';

/**
 * Enregistre les routes de gestion des surcharges de permissions par utilisateur
 * sous le préfixe /api/admin/overrides.
 * Une surcharge permet d'accorder ou de refuser une permission spécifique à un utilisateur
 * indépendamment de ses rôles.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function adminOverrideRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminOverrideController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne toutes les surcharges de permissions pour un utilisateur donné. */
  server.get('/:userId', {
    schema: {
      params: OverrideUserParamsSchema,
      response: { 200: z.array(AdminOverrideSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    },
  }, ctrl.getByUser.bind(ctrl));

  /** Crée ou met à jour une surcharge de permission pour un utilisateur donné (upsert). */
  server.post('/:userId', {
    schema: {
      params: OverrideUserParamsSchema,
      body: CreateOverrideSchema,
      response: { 201: AdminOverrideSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.upsert.bind(ctrl));

  /** Supprime la surcharge d'une permission spécifique pour un utilisateur donné. */
  server.delete('/:userId/:permissionKey', {
    schema: {
      params: OverrideDeleteParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.delete.bind(ctrl));
}
