import { initContract } from '@ts-rest/core';
import { accessContract } from './contracts/access.contract';
import { adminDiscordMappingContract } from './contracts/adminDiscordMapping.contract';
import { adminOverridesContract } from './contracts/adminOverrides.contract';
import { adminPermisisionsContract } from './contracts/adminPermisisions.contract';
import { adminRoleContract } from './contracts/adminRoles.contract';
import { adminSessionsContract } from './contracts/adminSessions.contract';
import { adminUsersContract } from './contracts/adminUsers.contract';
import { authorizeContract } from './contracts/authorize.contract';

// Contracts (ts-rest)
export { accessContract } from './contracts/access.contract';
export { authorizeContract } from './contracts/authorize.contract';

// Admin schemas
export {
  AdminDiscordMappingSchema,
  AdminErrorSchema,
  AdminOverrideSchema,
  AdminPermissionSchema,
  AdminRoleSchema,
  AdminSessionSchema,
  AdminUserSchema,
  CreateDiscordMappingSchema,
  CreateOverrideSchema,
  CreatePermissionSchema,
  CreateRoleSchema,
  DeletePermissionSchema,
  UpdatePermissionSchema,
  DisableUserSchema,
  MappingParamsSchema,
  OverrideDeleteParamsSchema,
  OverrideUserParamsSchema,
  AddRolePermissionSchema,
  RoleParamsSchema,
  RolePermissionItemSchema,
  RolePermissionParamsSchema,
  SessionParamsSchema,
  UpdateRoleSchema,
  UserParamsSchema,
} from './schemas/admin.schema';
export type {
  AddRolePermission,
  AdminDiscordMapping,
  AdminOverride,
  AdminPermission,
  AdminRole,
  AdminSession,
  AdminUser,
  CreateDiscordMapping,
  CreateOverride,
  CreatePermission,
  CreateRole,
  DeletePermission,
  RolePermissionItem,
  UpdatePermission,
  UpdateRole,
} from './schemas/admin.schema';

// Schemas
export {
  AccessMeResponseSchema,
  AccessUserSchema,
} from './schemas/access.schema';
export type { AccessMeResponse, AccessUser } from './schemas/access.schema';

export {
  AuthorizeBodySchema,
  AuthorizeFailSchema,
  AuthorizeResponseSchema,
  AuthorizeSuccessSchema,
} from './schemas/authorize.schema';
export type {
  AuthorizeBody,
  AuthorizeFail,
  AuthorizeResponse,
  AuthorizeSuccess,
} from './schemas/authorize.schema';

// Permissions
export { PERMISSIONS, PermissionSchema } from './permissions';
export type { Permission } from './permissions';

// Shared types
export {
  AuthorizedUserSchema,
  DiscordSnowflakeSchema,
  FailReason,
  FailReasonSchema,
  MyAccessSchema,
} from './types';
export type {
  AuthorizedUser,
  DiscordSnowflake,
  FailResponse,
  MyAccess,
} from './types';

const c = initContract();

export const adminContract = c.router({
  access: accessContract,
  adminSessions: adminSessionsContract,
  adminRole: adminRoleContract,
  adminPermisisions: adminPermisisionsContract,
  adminDiscordMapping: adminDiscordMappingContract,
  adminOverrides: adminOverridesContract,
  adminUsers: adminUsersContract,
  authorize: authorizeContract,
});
