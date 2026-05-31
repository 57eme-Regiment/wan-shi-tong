import { container } from '@/infrastructure/container';
import { AdminErrorSchema, DisableUserSchema, UserParamsSchema } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminUserController } from './adminUser.controller';

/**
 * Enregistre les routes d'actions administratives sur les utilisateurs
 * sous le préfixe /api/admin/users.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function adminUserRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminUserController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Désactive le compte d'un utilisateur identifié par son userId. */
  server.post('/:userId/disable', {
    schema: {
      params: UserParamsSchema,
      body: DisableUserSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema, 409: AdminErrorSchema },
    },
  }, ctrl.disable.bind(ctrl));

  /** Réactive le compte d'un utilisateur précédemment désactivé. */
  server.post('/:userId/enable', {
    schema: {
      params: UserParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema, 409: AdminErrorSchema },
    },
  }, ctrl.enable.bind(ctrl));

  /** Active ou désactive le statut super admin d'un utilisateur. */
  server.post('/:userId/super-admin', {
    schema: {
      params: UserParamsSchema,
      body: z.object({ value: z.boolean() }),
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.setSuperAdmin.bind(ctrl));

  /** Synchronise les rôles Discord de l'utilisateur avec ses rôles internes. */
  server.post('/:userId/sync-discord', {
    schema: {
      params: UserParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.syncDiscord.bind(ctrl));
}
