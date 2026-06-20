import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { PERMISSIONS } from '../permissions';
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
        'Retourne toutes les sessions non expirées, triées par date de création décroissante. ' +
        "Inclut adresse IP, user-agent et date d'expiration. Requiert `WAN_SESSION_READ`.",
      metadata: {
        tags: ['Admin - Sessions'],
        permission: PERMISSIONS.WAN_SESSION_READ,
      },
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
        'Retourne 404 si la session est introuvable. Requiert `WAN_SESSION_REVOKE`.',
      metadata: {
        tags: ['Admin - Sessions'],
        permission: PERMISSIONS.WAN_SESSION_REVOKE,
      },
    }),
  },
  { pathPrefix: '/admin/sessions' },
);
