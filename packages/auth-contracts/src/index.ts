// Contracts (ts-rest)
export { accessContract } from './contracts/access.contract';
export { authorizeContract } from './contracts/authorize.contract';

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
