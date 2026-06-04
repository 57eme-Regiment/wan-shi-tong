import { initContract } from '@ts-rest/core';
import { UserParamsSchema } from '../schemas/admin.schema';
import { ErrorSchema, UserSchema } from '../schemas/user.schema';

const c = initContract();

export const UsersContract = c.router(
  {
    getById: c.query({
      method: 'GET',
      path: '/:userId',
      pathParams: UserParamsSchema,
      summary: 'Récupère un utilisateur par son ID',
      description:
        'Retourne les informations publiques de base (id, nom, avatar, statut) ' +
        "d'un utilisateur identifié par son UUID interne.",
      metadata: { tags: ['Utilisateurs'] },
      responses: {
        200: UserSchema,
        401: ErrorSchema,
        403: ErrorSchema,
      },
    }),
  },
  { pathPrefix: '/api/users' },
);
