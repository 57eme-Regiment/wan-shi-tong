import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { AccessMeResponseSchema } from '../schemas/access.schema';

const c = initContract();

export const accessContract = c.router({
  me: {
    method: 'GET',
    path: '/access/me',
    responses: {
      200: AccessMeResponseSchema,
      401: z.object({ code: z.string() }),
      403: z.object({ code: z.string() }),
    },
    summary: 'Retourne les rôles et permissions de l\'utilisateur connecté',
  },
});
