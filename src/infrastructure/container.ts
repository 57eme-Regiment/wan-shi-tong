import { AuthorizeController } from '@/authorize/authorize.controller';
import { AccessController } from '@/services/access/access.controller';
import { DiscordRoleSyncRepository } from '@/services/discord/discord-role-sync.repository';
import { DiscordRoleSyncService } from '@/services/discord/discordRoleSync.service';
import { PermissionResolverRepository } from '@/services/permission/permissionResolver.repository';
import { PermissionResolverService } from '@/services/permission/permissionResolver.service';
import { AdminDiscordMappingController } from '@/servicesAdmin/discordMapping/adminDiscordMapping.controller';
import { AdminDiscordMappingRepository } from '@/servicesAdmin/discordMapping/adminDiscordMapping.repository';
import { AdminDiscordMappingService } from '@/servicesAdmin/discordMapping/adminDiscordMapping.service';
import { AdminOverrideController } from '@/servicesAdmin/overrides/adminOverride.controller';
import { AdminOverrideRepository } from '@/servicesAdmin/overrides/adminOverride.repository';
import { AdminOverrideService } from '@/servicesAdmin/overrides/adminOverride.service';
import { AdminPermissionController } from '@/servicesAdmin/permissions/adminPermission.controller';
import { AdminPermissionService } from '@/servicesAdmin/permissions/adminPermission.service';
import { AdminRoleController } from '@/servicesAdmin/roles/adminRole.controller';
import { AdminRoleRepository } from '@/servicesAdmin/roles/adminRole.repository';
import { AdminRoleService } from '@/servicesAdmin/roles/adminRole.service';
import { AdminSessionController } from '@/servicesAdmin/sessions/adminSession.controller';
import { AdminSessionService } from '@/servicesAdmin/sessions/adminSession.service';
import { AdminUserController } from '@/servicesAdmin/users/adminUser.controller';
import { AdminUserService } from '@/servicesAdmin/users/adminUser.service';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Database } from './database';

container.registerSingleton(Database);

container.registerSingleton(DiscordRoleSyncRepository);
container.registerSingleton(DiscordRoleSyncService);

container.registerSingleton(PermissionResolverRepository);
container.registerSingleton(PermissionResolverService);

container.registerSingleton(AccessController);
container.registerSingleton(AuthorizeController);

container.registerSingleton(AdminRoleRepository);
container.registerSingleton(AdminRoleService);
container.registerSingleton(AdminRoleController);
container.registerSingleton(AdminPermissionService);
container.registerSingleton(AdminPermissionController);
container.registerSingleton(AdminDiscordMappingRepository);
container.registerSingleton(AdminDiscordMappingService);
container.registerSingleton(AdminDiscordMappingController);
container.registerSingleton(AdminOverrideRepository);
container.registerSingleton(AdminOverrideService);
container.registerSingleton(AdminOverrideController);
container.registerSingleton(AdminUserService);
container.registerSingleton(AdminUserController);
container.registerSingleton(AdminSessionService);
container.registerSingleton(AdminSessionController);

export { container };
