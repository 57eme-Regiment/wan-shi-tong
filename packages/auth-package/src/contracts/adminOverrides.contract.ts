import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminOverrideSchema,
  CreateOverrideSchema,
  OverrideDeleteParamsSchema,
  OverrideUserParamsSchema,
} from '../schemas/admin.schema';
import { PERMISSIONS } from '../permissions';

const c = initContract();

export const adminOverridesContract = c.router(
  {
    getOverrides: c.query({
      method: 'GET',
      path: '/:userId',
      pathParams: OverrideUserParamsSchema,
      responses: {
        200: z.array(AdminOverrideSchema),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
      },
      summary: "Lister les overrides de permissions d'un utilisateur",
      description:
        'Retourne tous les overrides de permissions (allow/deny) configurés pour un utilisateur donné. ' +
        "Un override permet d'accorder ou de refuser une permission indépendamment des rôles. " +
        'Requiert la permission `WAN_OVERRIDE_READ`.',
      metadata: {
        tags: ['Admin - Overrides'],
        permission: PERMISSIONS.WAN_OVERRIDE_READ,
      },
    }),
    upsertOverride: c.mutation({
      method: 'POST',
      path: '/:userId',
      pathParams: OverrideUserParamsSchema,
      body: CreateOverrideSchema,
      responses: {
        201: AdminOverrideSchema,
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: 'Créer ou mettre à jour un override de permission',
      description:
        "Crée ou met à jour (upsert) l'override d'une permission pour un utilisateur. " +
        "L'effet peut être `allow` (forcer l'accès) ou `deny` (bloquer l'accès). " +
        "Invalide le snapshot d'accès de l'utilisateur. " +
        'Retourne 404 si la permission est introuvable. Requiert `WAN_OVERRIDE_MANAGE`.',
      metadata: {
        tags: ['Admin - Overrides'],
        permission: PERMISSIONS.WAN_OVERRIDE_MANAGE,
      },
    }),
    deleteOverride: c.mutation({
      method: 'DELETE',
      path: '/:userId/:permissionKey',
      pathParams: OverrideDeleteParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: 'Supprimer un override de permission',
      description:
        "Supprime l'override d'une permission pour un utilisateur et invalide son snapshot d'accès. " +
        'Retourne 404 si la permission ou le override est introuvable. Requiert `ADMIN_PERMISSIONS_MANAGE`.',
      metadata: {
        tags: ['Admin - Overrides'],
        permission: PERMISSIONS.WAN_OVERRIDE_DELETE,
      },
    }),
  },
  { pathPrefix: '/admin/overrides' },
);
