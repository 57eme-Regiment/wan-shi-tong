import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { PERMISSIONS } from '../permissions';
import {
  AdminDiscordMappingSchema,
  AdminErrorSchema,
  CreateDiscordMappingSchema,
  MappingParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminDiscordMappingContract = c.router(
  {
    getMappings: c.query({
      method: 'GET',
      path: '/',
      responses: {
        200: z.array(AdminDiscordMappingSchema),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
      },
      summary: 'Lister les mappings Discord → rôle applicatif',
      description:
        'Retourne tous les mappings entre rôles Discord et rôles applicatifs, ' +
        'triés par guildId. Inclut la clé et le nom du rôle applicatif associé. ' +
        'Requiert la permission `WAN_DISCORD_MAPPING_READ`.',
      metadata: {
        tags: ['Admin - Discord'],
        permission: PERMISSIONS.WAN_DISCORD_MAPPING_READ,
      },
    }),
    createMapping: c.mutation({
      method: 'POST',
      path: '/',
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
        'Invalide les snapshots des utilisateurs possédant ce rôle Discord dans la guilde. ' +
        'Retourne 404 si le rôle applicatif est introuvable. Requiert `WAN_DISCORD_MAPPING_CREATE`.',
      metadata: {
        tags: ['Admin - Discord'],
        permission: PERMISSIONS.WAN_DISCORD_MAPPING_CREATE,
      },
    }),
    deleteMapping: c.mutation({
      method: 'DELETE',
      path: '/:id',
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
        'Requiert la permission `WAN_DISCORD_MAPPING_DELETE`.',
      metadata: {
        tags: ['Admin - Discord'],
        permission: PERMISSIONS.WAN_DISCORD_MAPPING_DELETE,
      },
    }),
  },
  { pathPrefix: '/admin/discord-mappings' },
);
