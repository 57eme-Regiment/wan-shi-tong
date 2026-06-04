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
  getMappings: {
    method: 'GET',
    path: '/admin/discord-mappings',
    responses: {
      200: z.array(AdminDiscordMappingSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Lister les mappings Discord → rôle applicatif',
    description:
      'Retourne tous les mappings entre rôles Discord et rôles applicatifs, ' +
      'triés par guildId. Inclut la clé et le nom du rôle applicatif associé. ' +
      'Requiert la permission `ADMIN_DISCORD_MAPPING_READ`.',
    metadata: { tags: ['Admin - Discord'] },
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
    description:
      'Associe un rôle Discord (identifié par guildId + discordRoleId) à un rôle applicatif (par sa clé). ' +
      "Invalide les snapshots des utilisateurs possédant ce rôle Discord dans la guilde. " +
      'Retourne 404 si le rôle applicatif est introuvable. Requiert `ADMIN_DISCORD_MAPPING_MANAGE`.',
    metadata: { tags: ['Admin - Discord'] },
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
    description:
      'Supprime le mapping et invalide les snapshots des utilisateurs concernés dans une transaction. ' +
      'Requiert la permission `ADMIN_DISCORD_MAPPING_MANAGE`.',
    metadata: { tags: ['Admin - Discord'] },
  },
});
