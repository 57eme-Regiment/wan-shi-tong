import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { AccessMeResponseSchema } from '../schemas/access.schema';

const c = initContract();

export const accessContract = c.router(
  {
    me: c.query({
      method: 'GET',
      path: '/me',
      responses: {
        200: AccessMeResponseSchema,
        401: z.object({ code: z.string() }),
        403: z.object({ code: z.string() }),
      },
      summary: "Récupère les accès de l'utilisateur connecté",
      description:
        "Retourne le profil, les rôles applicatifs et la liste des permissions de l'utilisateur authentifié. " +
        'Résout les permissions depuis les rôles Discord (via les mappings configurés) et les overrides individuels.',
      metadata: { tags: ['Accès'] },
    }),
  },
  { pathPrefix: '/access' },
);
