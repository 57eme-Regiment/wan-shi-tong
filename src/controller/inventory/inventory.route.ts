import { container } from '@/infrastructure/container';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import {
  InventorySchema,
  createInventorySchema,
  inventoryParamsSchema,
  updateInventorySchema,
} from './inventory.schema';
import { z } from 'zod';
import { InventoryController } from './inventory.controller';

const errorSchema = z.object({ message: z.string(), error: z.string() });

export async function inventoryRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(InventoryController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/',
    {
      schema: { response: { 200: z.array(InventorySchema) } },
    },
    ctrl.getAll.bind(ctrl),
  );

  server.get(
    '/:id',
    {
      schema: {
        params: inventoryParamsSchema,
        response: { 200: InventorySchema, 404: errorSchema },
      },
    },
    ctrl.getById.bind(ctrl),
  );

  server.post(
    '/',
    {
      schema: {
        body: createInventorySchema,
        response: { 201: InventorySchema },
      },
    },
    ctrl.create.bind(ctrl),
  );

  server.put(
    '/:id',
    {
      schema: {
        params: inventoryParamsSchema,
        body: updateInventorySchema,
        response: { 200: InventorySchema, 404: errorSchema },
      },
    },
    ctrl.update.bind(ctrl),
  );

  server.delete(
    '/:id',
    {
      schema: {
        params: inventoryParamsSchema,
        response: { 204: z.null(), 404: errorSchema },
      },
    },
    ctrl.delete.bind(ctrl),
  );
}
