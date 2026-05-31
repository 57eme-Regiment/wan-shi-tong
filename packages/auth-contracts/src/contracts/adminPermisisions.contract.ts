import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  AdminErrorSchema,
  AdminPermissionSchema,
  CreatePermissionSchema,
  DeletePermissionSchema,
  UpdatePermissionSchema,
} from '../schemas/admin.schema';

const c = initContract();

export const adminPermisisionsContract = c.router({
  // Permissions
  getPermissions: {
    method: 'GET',
    path: '/admin/permissions',
    responses: {
      200: z.array(AdminPermissionSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
    },
    summary: 'Lister les permissions',
  },
  createPermissions: {
    method: 'POST',
    path: '/admin/permissions',
    body: CreatePermissionSchema,
    responses: {
      200: z.array(AdminPermissionSchema),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      409: AdminErrorSchema,
    },
    summary: 'Crée une nouvelle permission',
  },
  updatePermission: {
    method: 'PUT',
    path: '/admin/permissions/:id',
    pathParams: DeletePermissionSchema,
    body: UpdatePermissionSchema,
    responses: {
      200: AdminPermissionSchema,
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Met à jour une permission',
  },
  deletePermissions: {
    method: 'DELETE',
    path: '/admin/permissions/:id',
    pathParams: DeletePermissionSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      401: AdminErrorSchema,
      403: AdminErrorSchema,
      404: AdminErrorSchema,
    },
    summary: 'Supprime une permission',
  },
});
