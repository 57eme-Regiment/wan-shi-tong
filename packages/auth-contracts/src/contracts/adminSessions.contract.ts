import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminSessionSchema,
  SessionParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminSessionsContract = c.router({
  getSessions: {
    method: 'GET',
    path: '/admin/sessions',
    responses: {
      200: z.array(AdminSessionSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Lister les sessions actives',
  },
  revokeSession: {
    method: 'DELETE',
    path: '/admin/sessions/:sessionId',
    pathParams: SessionParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Révoquer une session',
  },
});
