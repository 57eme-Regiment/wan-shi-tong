import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminSessionSchema,
  SessionParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminSessionsContract = c.router(
  {
    getSessions: c.query({
      method: 'GET',
      path: '/',
      responses: {
        200: z.array(AdminSessionSchema),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
      },
      summary: 'Lister les sessions actives',
      description:
        "Retourne toutes les sessions non expirées, triées par date de création décroissante. " +
        "Inclut adresse IP, user-agent et date d'expiration. Requiert `ADMIN_SESSIONS_READ`.",
      metadata: { tags: ['Admin - Sessions'] },
    }),
    revokeSession: c.mutation({
      method: 'DELETE',
      path: '/:sessionId',
      pathParams: SessionParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: 'Révoquer une session',
      description:
        'Supprime immédiatement une session, déconnectant le navigateur concerné. ' +
        'Retourne 404 si la session est introuvable. Requiert `ADMIN_SESSIONS_REVOKE`.',
      metadata: { tags: ['Admin - Sessions'] },
    }),
  },
  { pathPrefix: '/admin/sessions' },
);
