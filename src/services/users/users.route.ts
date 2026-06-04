import { container } from '@/infrastructure/container';
import { declareRoute } from '@/shared/utils/declareRoute';
import { contract } from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { UsersController } from './users.controller';

const errorSchema = z.object({ message: z.string(), error: z.string() });

export async function UsersRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(UsersController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(
    server,
    contract.users.getById,
    ctrl.getInventoriesList.bind(ctrl),
  );
}
