import { Database } from '@/infrastructure/database';
import type {
  CreateInventory,
  Inventory,
  UpdateInventory,
} from '@/controller/inventory/inventory.schema';
import { injectable } from 'tsyringe';
import type { IInventoryRepository } from './inventory.repository.interface';

/** Implémentation Prisma du repository pour les inventaires. */
@injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(private readonly db: Database) {}

  /** @inheritdoc */
  findAll(): Promise<Inventory[]> {
    return this.db.context.inventory.findMany({});
  }

  /** @inheritdoc */
  findById(id: string): Promise<Inventory | null> {
    return this.db.context.inventory.findUnique({ where: { id } });
  }

  /** @inheritdoc */
  create(data: CreateInventory): Promise<Inventory> {
    return this.db.context.inventory.create({ data });
  }

  /** @inheritdoc */
  update(id: string, data: UpdateInventory): Promise<Inventory> {
    return this.db.context.inventory.update({ where: { id }, data });
  }

  /** @inheritdoc */
  async delete(id: string): Promise<void> {
    await this.db.context.inventory.delete({ where: { id } });
  }
}
