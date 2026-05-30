import { container } from '@/infrastructure/container';
import { MyAccessSchema } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AccessController } from './access.controller';

const errorSchema = z.object({ code: z.string() });

/**
 * Enregistre les routes d'accès sous le préfixe /api/access.
 * Expose les permissions et rôles de l'utilisateur authentifié courant.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function accessRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AccessController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne les accès (rôles et permissions) de l'utilisateur authentifié. */
  server.get(
    '/me',
    {
      schema: {
        response: {
          200: MyAccessSchema,
          401: errorSchema,
          403: errorSchema,
        },
      },
    },
    ctrl.getMe.bind(ctrl),
  );
}
