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

export const adminPermisisionsContract = c.router(
  {
    getPermissions: c.query({
      method: 'GET',
      path: '/',
      responses: {
        200: z.array(AdminPermissionSchema),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
      },
      summary: 'Lister les permissions applicatives',
      description:
        'Retourne la liste de toutes les permissions disponibles dans le système, triées par clé. ' +
        'Requiert la permission `ADMIN_PERMISSIONS_READ`.',
      metadata: { tags: ['Admin - Permissions'] },
    }),
    createPermissions: c.mutation({
      method: 'POST',
      path: '/',
      body: CreatePermissionSchema,
      responses: {
        201: AdminPermissionSchema.array(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        409: AdminErrorSchema,
      },
      summary: 'Créer une nouvelle permission',
      description:
        'Crée une nouvelle permission applicative identifiée par une clé unique. ' +
        'Retourne 409 si une permission avec cette clé existe déjà. Requiert `ADMIN_PERMISSIONS_MANAGE`.',
      metadata: { tags: ['Admin - Permissions'] },
    }),
    updatePermission: c.mutation({
      method: 'PUT',
      path: '/:id',
      pathParams: DeletePermissionSchema,
      body: UpdatePermissionSchema,
      responses: {
        200: AdminPermissionSchema,
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: 'Modifier une permission',
      description:
        'Met à jour la clé ou la description de la permission. ' +
        'Requiert la permission `ADMIN_PERMISSIONS_MANAGE`.',
      metadata: { tags: ['Admin - Permissions'] },
    }),
    deletePermissions: c.mutation({
      method: 'DELETE',
      path: '/:id',
      pathParams: DeletePermissionSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        401: AdminErrorSchema,
        403: AdminErrorSchema,
        404: AdminErrorSchema,
      },
      summary: 'Supprimer une permission',
      description:
        'Supprime la permission et invalide tous les snapshots dans une transaction ' +
        '(les rôles peuvent en dépendre). Requiert `ADMIN_PERMISSIONS_MANAGE`.',
      metadata: { tags: ['Admin - Permissions'] },
    }),
  },
  { pathPrefix: '/admin/permissions' },
);
