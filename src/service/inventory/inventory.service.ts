import type { IInventoryRepository } from '@/repository/inventory/inventory.repository.interface';
import { AppError } from '@/shared/errors/appError';
import type {
  CreateInventory,
  Inventory,
  UpdateInventory,
} from '@/controller/inventory/inventory.schema';
import { inject, injectable } from 'tsyringe';
import type { IInventoryService } from './inventory.service.interface';

/** Implémentation du service métier pour les inventaires. */
@injectable()
export class InventoryService implements IInventoryService {
  constructor(
    @inject('IInventoryRepository')
    private readonly inventoryRepo: IInventoryRepository,
  ) {}

  /** @inheritdoc */
  async getAll(): Promise<Inventory[]> {
    return this.inventoryRepo.findAll();
  }

  /** @inheritdoc */
  async getById(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepo.findById(id);
    if (!inventory)
      throw new AppError('Inventory not found', 404, 'INVENTORY_NOT_FOUND');
    return inventory;
  }

  /** @inheritdoc */
  async create(data: CreateInventory): Promise<Inventory> {
    return this.inventoryRepo.create(data);
  }

  /** @inheritdoc */
  async update(id: string, data: UpdateInventory): Promise<Inventory> {
    await this.getById(id);
    return this.inventoryRepo.update(id, data);
  }

  /** @inheritdoc */
  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.inventoryRepo.delete(id);
  }
}
