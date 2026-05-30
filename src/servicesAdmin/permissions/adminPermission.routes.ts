import { container } from '@/infrastructure/container';
import { AdminErrorSchema, AdminPermissionSchema } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminPermissionController } from './adminPermission.controller';

/**
 * Enregistre les routes de consultation des permissions sous le préfixe /api/admin/permissions.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function adminPermissionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminPermissionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne la liste de toutes les permissions disponibles dans le système. */
  server.get('/', {
    schema: { response: { 200: z.array(AdminPermissionSchema), 401: AdminErrorSchema, 403: AdminErrorSchema } },
  }, ctrl.getAll.bind(ctrl));
}
