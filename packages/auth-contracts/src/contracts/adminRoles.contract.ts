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
  getRoles: {
    method: 'GET',
    path: '/admin/roles',
    responses: {
      200: z.array(AdminRoleSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Lister les rôles applicatifs',
    description:
      'Retourne la liste de tous les rôles applicatifs triés par date de création. ' +
      'Requiert la permission `ADMIN_ROLES_READ`.',
    metadata: { tags: ['Admin - Rôles'] },
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
    description:
      'Crée un nouveau rôle identifié par une clé unique. ' +
      'Requiert la permission `ADMIN_ROLES_MANAGE`.',
    metadata: { tags: ['Admin - Rôles'] },
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
    description:
      'Met à jour les champs (clé, nom, description) du rôle. ' +
      "Invalide tous les snapshots d'accès utilisateurs afin que les permissions soient recalculées. " +
      'Requiert la permission `ADMIN_ROLES_MANAGE`.',
    metadata: { tags: ['Admin - Rôles'] },
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
    description:
      'Supprime le rôle et invalide tous les snapshots dans une transaction. ' +
      'Requiert la permission `ADMIN_ROLES_MANAGE`.',
    metadata: { tags: ['Admin - Rôles'] },
  },
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
    summary: "Lister les permissions d'un rôle",
    description:
      'Retourne les permissions (id, clé, description) assignées à un rôle. ' +
      'Requiert la permission `ADMIN_ROLES_READ`.',
    metadata: { tags: ['Admin - Rôles'] },
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
    description:
      'Associe une permission existante à un rôle et invalide les snapshots. ' +
      'Retourne 409 si la permission est déjà assignée. Requiert `ADMIN_ROLES_MANAGE`.',
    metadata: { tags: ['Admin - Rôles'] },
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
    summary: "Retirer une permission d'un rôle",
    description:
      "Dissocie la permission du rôle et invalide les snapshots dans une transaction. " +
      'Retourne 404 si le lien est introuvable. Requiert `ADMIN_ROLES_MANAGE`.',
    metadata: { tags: ['Admin - Rôles'] },
  },
});
