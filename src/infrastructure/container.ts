import { AccessController } from '@/access/access.controller';
import { AuthorizeController } from '@/authorize/authorize.controller';
import { InventoryController } from '@/controller/inventory/inventory.controller';
import { DiscordRoleSyncRepository } from '@/repository/discord/discord-role-sync.repository';
import { IDiscordRoleSyncRepository } from '@/repository/discord/discord-role-sync.repository.interface';
import { InventoryRepository } from '@/repository/inventory/inventory.repository';
import { IInventoryRepository } from '@/repository/inventory/inventory.repository.interface';
import { PermissionResolverRepository } from '@/repository/permission/permissionResolver.repository';
import { IPermissionResolverRepository } from '@/repository/permission/permissionResolver.repository.interface';
import { DiscordRoleSyncService } from '@/service/discord/discordRoleSync.service';
import { IDiscordRoleSyncService } from '@/service/discord/discordRoleSync.service.interface';
import { InventoryService } from '@/service/inventory/inventory.service';
import { IInventoryService } from '@/service/inventory/inventory.service.interface';
import { PermissionResolverService } from '@/service/permission/permissionResolver.service';
import { IPermissionResolverService } from '@/service/permission/permissionResolver.service.interface';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Database } from './database';

container.registerSingleton(Database);

container.registerSingleton<IDiscordRoleSyncRepository>(
  'IDiscordRoleSyncRepository',
  DiscordRoleSyncRepository,
);
container.registerSingleton<IDiscordRoleSyncService>(
  'IDiscordRoleSyncService',
  DiscordRoleSyncService,
);

container.registerSingleton<IPermissionResolverRepository>(
  'IPermissionResolverRepository',
  PermissionResolverRepository,
);
container.registerSingleton<IPermissionResolverService>(
  'IPermissionResolverService',
  PermissionResolverService,
);

container.registerSingleton<IInventoryRepository>(
  'IInventoryRepository',
  InventoryRepository,
);
container.registerSingleton<IInventoryService>(
  'IInventoryService',
  InventoryService,
);
container.registerSingleton(AccessController);
container.registerSingleton(AuthorizeController);
container.registerSingleton(InventoryController);

export { container };
