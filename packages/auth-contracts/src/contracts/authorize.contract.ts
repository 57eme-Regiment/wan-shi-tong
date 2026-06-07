import { initContract } from '@ts-rest/core';
import { AuthorizeBodySchema, AuthorizeResponseSchema } from '../schemas/authorize.schema';

const c = initContract();

export const authorizeContract = c.router(
  {
    check: c.mutation({
      method: 'POST',
      path: '/',
      body: AuthorizeBodySchema,
      responses: {
        200: AuthorizeResponseSchema,
      },
      summary: "Vérifie si l'utilisateur connecté possède une permission",
      description:
        "Endpoint inter-services : vérifie si la session courante (cookie) dispose de la permission demandée. " +
        "Retourne toujours 200 avec `{ allowed: boolean }`. " +
        "En cas de session absente ou de compte désactivé, `allowed` vaut `false` avec un champ `reason`. " +
        'Les super-admins obtiennent toujours `allowed: true`.',
      metadata: { tags: ['Autorisation'] },
    }),
  },
  { pathPrefix: '/authorize' },
);
