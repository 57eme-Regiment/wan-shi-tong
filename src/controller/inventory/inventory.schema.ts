import { z } from 'zod';

export const InventorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  accessCode: z.string().nullable(),
  ownerId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createInventorySchema = z.object({
  name: z.string(),
  accessCode: z.string().optional(),
  ownerId: z.string().optional(),
});

export const updateInventorySchema = createInventorySchema.partial();

export const inventoryParamsSchema = z.object({
  id: z.uuid(),
});

export type Inventory = z.infer<typeof InventorySchema>;
export type CreateInventory = z.infer<typeof createInventorySchema>;
export type UpdateInventory = z.infer<typeof updateInventorySchema>;
export type InventoryParams = z.infer<typeof inventoryParamsSchema>;
