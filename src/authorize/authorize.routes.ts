import { container } from '@/infrastructure/container';
import { AuthorizeResponseSchema, PermissionSchema } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthorizeController } from './authorize.controller';

export async function authorizeRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AuthorizeController);
  const server = app.withTypeProvider<ZodTypeProvider>();

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
