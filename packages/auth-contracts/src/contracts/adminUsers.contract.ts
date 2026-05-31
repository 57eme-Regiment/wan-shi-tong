import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminUserSchema,
  DisableUserSchema,
  UserParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminUsersContract = c.router({
  // Users
  getAll: {
    method: 'GET',
    path: '/admin/users',
    responses: {
      200: AdminUserSchema.array(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Récupère tout les compte utilisateur',
  },
  disableUser: {
    method: 'POST',
    path: '/admin/users/:userId/disable',
    pathParams: UserParamsSchema,
    body: DisableUserSchema,
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
      409: AdminErrorSchema,
    },
    summary: 'Désactiver un compte utilisateur',
  },
  enableUser: {
    method: 'POST',
    path: '/admin/users/:userId/enable',
    pathParams: UserParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
      409: AdminErrorSchema,
    },
    summary: 'Réactiver un compte utilisateur',
  },
  syncDiscord: {
    method: 'POST',
    path: '/admin/users/:userId/sync-discord',
    pathParams: UserParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: "Resynchroniser les rôles Discord d'un utilisateur",
  },
  setSuperAdmin: {
    method: 'POST',
    path: '/admin/users/:userId/super-admin',
    pathParams: UserParamsSchema,
    body: z.object({ value: z.boolean() }),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: "Activer ou désactiver le statut super admin d'un utilisateur",
  },
});
