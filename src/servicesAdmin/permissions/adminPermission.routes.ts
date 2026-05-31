import { container } from '@/infrastructure/container';
import {
  AdminErrorSchema,
  AdminPermissionSchema,
  CreatePermissionSchema,
  DeletePermissionSchema,
  UpdatePermissionSchema,
} from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminPermissionController } from './adminPermission.controller';

export async function adminPermissionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminPermissionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne la liste de toutes les permissions disponibles dans le système. */
  server.get('/', {
    schema: {
      response: { 200: z.array(AdminPermissionSchema), 401: AdminErrorSchema, 403: AdminErrorSchema },
    },
  }, ctrl.getAll.bind(ctrl));

  /** Crée une nouvelle permission applicative. */
  server.post('/', {
    schema: {
      body: CreatePermissionSchema,
      response: { 201: AdminPermissionSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 409: AdminErrorSchema },
    },
  }, ctrl.create.bind(ctrl));

  /** Met à jour une permission existante. */
  server.put('/:id', {
    schema: {
      params: DeletePermissionSchema,
      body: UpdatePermissionSchema,
      response: { 200: AdminPermissionSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.update.bind(ctrl));

  /** Supprime une permission par son id. */
  server.delete('/:id', {
    schema: {
      params: DeletePermissionSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.delete.bind(ctrl));
}
