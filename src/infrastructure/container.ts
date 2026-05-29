import { InventoryController } from '@/controller/inventory/inventory.controller';
import { InventoryRepository } from '@/repository/inventory/inventory.repository';
import { IInventoryRepository } from '@/repository/inventory/inventory.repository.interface';
import { InventoryService } from '@/service/inventory/inventory.service';
import { IInventoryService } from '@/service/inventory/inventory.service.interface';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Database } from './database';

container.registerSingleton(Database);

container.registerSingleton<IInventoryRepository>(
  'IInventoryRepository',
  InventoryRepository,
);
container.registerSingleton<IInventoryService>(
  'IInventoryService',
  InventoryService,
);
container.registerSingleton(InventoryController);

export { container };
