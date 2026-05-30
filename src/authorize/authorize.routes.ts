import { container } from '@/infrastructure/container';
import { AuthorizeResponseSchema, PermissionSchema } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthorizeController } from './authorize.controller';

/**
 * Enregistre les routes d'autorisation sous le préfixe /api/authorize.
 * Permet de vérifier si l'utilisateur courant possède une permission donnée.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function authorizeRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AuthorizeController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Vérifie si l'utilisateur authentifié possède la permission fournie dans le corps de la requête. */
  server.post(
    '/',
    {
      schema: {
        body: z.object({ permission: PermissionSchema }),
        response: { 200: AuthorizeResponseSchema },
      },
    },
    ctrl.authorize.bind(ctrl),
  );
}
