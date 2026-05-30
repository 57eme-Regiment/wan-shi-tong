import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminDiscordMappingSchema,
  AdminErrorSchema,
  AdminOverrideSchema,
  AdminPermissionSchema,
  AdminRoleSchema,
  AdminSessionSchema,
  CreateDiscordMappingSchema,
  CreateOverrideSchema,
  CreateRoleSchema,
  DisableUserSchema,
  MappingParamsSchema,
  OverrideDeleteParamsSchema,
  OverrideUserParamsSchema,
  RoleParamsSchema,
  SessionParamsSchema,
  UpdateRoleSchema,
  UserParamsSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminContract = c.router({
  // Roles
  getRoles: {
    method: 'GET',
    path: '/admin/roles',
    responses: { 200: z.array(AdminRoleSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    summary: 'Lister les rôles applicatifs',
  },
  createRole: {
    method: 'POST',
    path: '/admin/roles',
    body: CreateRoleSchema,
    responses: { 201: AdminRoleSchema, 401: AdminErrorSchema, 403: AdminErrorSchema },
    summary: 'Créer un rôle applicatif',
  },
  updateRole: {
    method: 'PUT',
    path: '/admin/roles/:id',
    pathParams: RoleParamsSchema,
    body: UpdateRoleSchema,
    responses: { 200: AdminRoleSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Modifier un rôle applicatif',
  },
  deleteRole: {
    method: 'DELETE',
    path: '/admin/roles/:id',
    pathParams: RoleParamsSchema,
    body: c.noBody(),
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Supprimer un rôle applicatif',
  },

  // Permissions
  getPermissions: {
    method: 'GET',
    path: '/admin/permissions',
    responses: { 200: z.array(AdminPermissionSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    summary: 'Lister les permissions',
  },

  // Discord mappings
  getMappings: {
    method: 'GET',
    path: '/admin/discord-mappings',
    responses: { 200: z.array(AdminDiscordMappingSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    summary: 'Lister les mappings Discord → rôle applicatif',
  },
  createMapping: {
    method: 'POST',
    path: '/admin/discord-mappings',
    body: CreateDiscordMappingSchema,
    responses: { 201: AdminDiscordMappingSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Créer un mapping Discord → rôle applicatif',
  },
  deleteMapping: {
    method: 'DELETE',
    path: '/admin/discord-mappings/:id',
    pathParams: MappingParamsSchema,
    body: c.noBody(),
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Supprimer un mapping Discord',
  },

  // Overrides
  getOverrides: {
    method: 'GET',
    path: '/admin/overrides/:userId',
    pathParams: OverrideUserParamsSchema,
    responses: { 200: z.array(AdminOverrideSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    summary: 'Lister les overrides de permissions d\'un utilisateur',
  },
  upsertOverride: {
    method: 'POST',
    path: '/admin/overrides/:userId',
    pathParams: OverrideUserParamsSchema,
    body: CreateOverrideSchema,
    responses: { 201: AdminOverrideSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Ajouter ou mettre à jour un override de permission',
  },
  deleteOverride: {
    method: 'DELETE',
    path: '/admin/overrides/:userId/:permissionKey',
    pathParams: OverrideDeleteParamsSchema,
    body: c.noBody(),
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Supprimer un override de permission',
  },

  // Users
  disableUser: {
    method: 'POST',
    path: '/admin/users/:userId/disable',
    pathParams: UserParamsSchema,
    body: DisableUserSchema,
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema, 409: AdminErrorSchema },
    summary: 'Désactiver un compte utilisateur',
  },
  enableUser: {
    method: 'POST',
    path: '/admin/users/:userId/enable',
    pathParams: UserParamsSchema,
    body: c.noBody(),
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema, 409: AdminErrorSchema },
    summary: 'Réactiver un compte utilisateur',
  },
  syncDiscord: {
    method: 'POST',
    path: '/admin/users/:userId/sync-discord',
    pathParams: UserParamsSchema,
    body: c.noBody(),
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Resynchroniser les rôles Discord d\'un utilisateur',
  },

  // Sessions
  getSessions: {
    method: 'GET',
    path: '/admin/sessions',
    responses: { 200: z.array(AdminSessionSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    summary: 'Lister les sessions actives',
  },
  revokeSession: {
    method: 'DELETE',
    path: '/admin/sessions/:sessionId',
    pathParams: SessionParamsSchema,
    body: c.noBody(),
    responses: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    summary: 'Révoquer une session',
  },
});
