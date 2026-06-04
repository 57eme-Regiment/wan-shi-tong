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
      summary: 'Récupère un user par son ID',
      description:
        'Retourne les information de base concernant un utilisateur par son id ',
      metadata: { tags: ['Users'] },
      responses: {
        200: UserSchema,
        401: ErrorSchema,
        403: ErrorSchema,
      },
    }),
  },
  { pathPrefix: '/api/users' },
);
