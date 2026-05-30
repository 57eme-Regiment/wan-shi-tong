import { container } from '@/infrastructure/container';
import { AdminErrorSchema, AdminSessionSchema, SessionParamsSchema } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminSessionController } from './adminSession.controller';

/**
 * Enregistre les routes de gestion des sessions actives sous le préfixe /api/admin/sessions.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function adminSessionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminSessionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne la liste de toutes les sessions actives. */
  server.get('/', {
    schema: { response: { 200: z.array(AdminSessionSchema), 401: AdminErrorSchema, 403: AdminErrorSchema } },
  }, ctrl.getAll.bind(ctrl));

  /** Révoque (supprime) une session identifiée par son sessionId. */
  server.delete('/:sessionId', {
    schema: {
      params: SessionParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.revoke.bind(ctrl));
}
