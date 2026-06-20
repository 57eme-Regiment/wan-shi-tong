import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminUserParamsSchema,
  AdminUserSchema,
  DisableUserSchema,
} from '../schemas/admin.schema';
import { UserQuerySchema, UserSchema } from '../schemas/user.schema';

const c = initContract();

export const adminUsersContract = c.router(
  {
    search: c.query({
      method: 'GET',
      path: '/search',
      query: UserQuerySchema,
      responses: {
        200: z.array(UserSchema),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
      },
      summary: 'Rechercher des utilisateurs',
      description:
        'Retourne les utilisateurs filtrés par fuzzy search sur le nom ou accountId. ' +
        'Requiert la permission `ADMIN_USERS_READ`.',
      metadata: { tags: ['Admin - Utilisateurs'] }, //TODO permission: PERMISSIONS.WAN_USERS_READ
    }),
    getAll: c.query({
      method: 'GET',
      path: '/',
      responses: {
        200: AdminUserSchema.array(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
      },
      summary: 'Lister tous les comptes utilisateurs',
      description:
        'Retourne la liste complète des utilisateurs avec leurs sessions actives. ' +
        'Requiert la permission `ADMIN_USERS_READ`.',
      metadata: { tags: ['Admin - Utilisateurs'] }, //TODO permission: PERMISSIONS.WAN_USERS_READ
    }),
    disableUser: c.mutation({
      method: 'POST',
      path: '/:userId/disable',
      pathParams: AdminUserParamsSchema,
      body: DisableUserSchema,
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
        409: AdminErrorSchema,
      },
      summary: 'Désactiver un compte utilisateur',
      description:
        "Désactive le compte d'un utilisateur et enregistre le motif. " +
        "Invalide les données de synchronisation Discord de l'utilisateur. " +
        'Retourne 409 si le compte est déjà désactivé. Requiert `ADMIN_USERS_MANAGE`.',
      metadata: { tags: ['Admin - Utilisateurs'] }, //TODO permission: PERMISSIONS.WAN_USERS_MANAGE
    }),
    enableUser: c.mutation({
      method: 'POST',
      path: '/:userId/enable',
      pathParams: AdminUserParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
        409: AdminErrorSchema,
      },
      summary: 'Réactiver un compte utilisateur',
      description:
        'Réactive un compte préalablement désactivé. ' +
        'Retourne 409 si le compte est déjà actif. Requiert `ADMIN_USERS_MANAGE`.',
      metadata: { tags: ['Admin - Utilisateurs'] }, //TODO permission: PERMISSIONS.WAN_USERS_MANAGE
    }),
    syncDiscord: c.mutation({
      method: 'POST',
      path: '/:userId/sync-discord',
      pathParams: AdminUserParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: "Resynchroniser les rôles Discord d'un utilisateur",
      description:
        "Déclenche une synchronisation manuelle des rôles Discord de l'utilisateur depuis le serveur configuré. " +
        "Invalide le snapshot d'accès afin que les permissions soient recalculées à la prochaine requête. " +
        'Retourne 404 si aucun compte Discord est lié. Requiert `ADMIN_USERS_MANAGE`.',
      metadata: { tags: ['Admin - Utilisateurs'] }, //TODO permission: PERMISSIONS.WAN_USERS_MANAGE
    }),
    setSuperAdmin: c.mutation({
      method: 'POST',
      path: '/:userId/super-admin',
      pathParams: AdminUserParamsSchema,
      body: z.object({ value: z.boolean() }),
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: "Modifier le statut super admin d'un utilisateur",
      description:
        "Active ou désactive le statut super admin d'un utilisateur. " +
        'Un super admin passe toutes les vérifications de permission. ' +
        "Invalide le snapshot d'accès si le statut change. Requiert `ADMIN_USERS_MANAGE`.",
      metadata: { tags: ['Admin - Utilisateurs'] }, //TODO permission: PERMISSIONS.WAN_USERS_SETADMIN
    }),
  },
  { pathPrefix: '/admin/users' },
);
