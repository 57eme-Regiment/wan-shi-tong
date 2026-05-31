import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminOverrideSchema,
  CreateOverrideSchema,
  OverrideDeleteParamsSchema,
  OverrideUserParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminOverridesContract = c.router({
  // Overrides
  getOverrides: {
    method: 'GET',
    path: '/admin/overrides/:userId',
    pathParams: OverrideUserParamsSchema,
    responses: {
      200: z.array(AdminOverrideSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: "Lister les overrides de permissions d'un utilisateur",
  },
  upsertOverride: {
    method: 'POST',
    path: '/admin/overrides/:userId',
    pathParams: OverrideUserParamsSchema,
    body: CreateOverrideSchema,
    responses: {
      201: AdminOverrideSchema,
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Ajouter ou mettre à jour un override de permission',
  },
  deleteOverride: {
    method: 'DELETE',
    path: '/admin/overrides/:userId/:permissionKey',
    pathParams: OverrideDeleteParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Supprimer un override de permission',
  },
});
