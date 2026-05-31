import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminDiscordMappingSchema,
  AdminErrorSchema,
  CreateDiscordMappingSchema,
  MappingParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminDiscordMappingContract = c.router({
  // Discord mappings
  getMappings: {
    method: 'GET',
    path: '/admin/discord-mappings',
    responses: {
      200: z.array(AdminDiscordMappingSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Lister les mappings Discord → rôle applicatif',
  },
  createMapping: {
    method: 'POST',
    path: '/admin/discord-mappings',
    body: CreateDiscordMappingSchema,
    responses: {
      201: AdminDiscordMappingSchema,
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Créer un mapping Discord → rôle applicatif',
  },
  deleteMapping: {
    method: 'DELETE',
    path: '/admin/discord-mappings/:id',
    pathParams: MappingParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Supprimer un mapping Discord',
  },
});
