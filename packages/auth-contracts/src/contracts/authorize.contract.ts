import { initContract } from '@ts-rest/core';
import { AuthorizeBodySchema, AuthorizeResponseSchema } from '../schemas/authorize.schema';

const c = initContract();

export const authorizeContract = c.router({
  check: {
    method: 'POST',
    path: '/authorize',
    body: AuthorizeBodySchema,
    responses: {
      200: AuthorizeResponseSchema,
    },
    summary: 'Vérifie si l\'utilisateur connecté possède une permission',
  },
});
