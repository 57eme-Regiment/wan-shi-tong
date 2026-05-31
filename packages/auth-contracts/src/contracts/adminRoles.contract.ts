import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AddRolePermissionSchema,
  AdminErrorSchema,
  AdminRoleSchema,
  CreateRoleSchema,
  RoleParamsSchema,
  RolePermissionItemSchema,
  RolePermissionParamsSchema,
  UpdateRoleSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminRoleContract = c.router({
  // Roles
  getRoles: {
    method: 'GET',
    path: '/admin/roles',
    responses: {
      200: z.array(AdminRoleSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Lister les rôles applicatifs',
  },
  createRole: {
    method: 'POST',
    path: '/admin/roles',
    body: CreateRoleSchema,
    responses: {
      201: AdminRoleSchema,
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Créer un rôle applicatif',
  },
  updateRole: {
    method: 'PUT',
    path: '/admin/roles/:id',
    pathParams: RoleParamsSchema,
    body: UpdateRoleSchema,
    responses: {
      200: AdminRoleSchema,
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Modifier un rôle applicatif',
  },
  deleteRole: {
    method: 'DELETE',
    path: '/admin/roles/:id',
    pathParams: RoleParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Supprimer un rôle applicatif',
  },

  // Gestion des permissions d'un rôle
  getRolePermissions: {
    method: 'GET',
    path: '/admin/roles/:roleId/permissions',
    pathParams: z.object({ roleId: z.string() }),
    responses: {
      200: z.array(RolePermissionItemSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Lister les permissions d\'un rôle',
  },
  addRolePermission: {
    method: 'POST',
    path: '/admin/roles/:roleId/permissions',
    pathParams: z.object({ roleId: z.string() }),
    body: AddRolePermissionSchema,
    responses: {
      201: RolePermissionItemSchema,
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
      409: AdminErrorSchema,
    },
    summary: 'Ajouter une permission à un rôle',
  },
  removeRolePermission: {
    method: 'DELETE',
    path: '/admin/roles/:roleId/permissions/:permissionId',
    pathParams: RolePermissionParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Retirer une permission d\'un rôle',
  },
});
