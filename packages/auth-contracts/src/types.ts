import z from 'zod';
import { PermissionSchema } from './permissions.js';

export const DiscordSnowflakeSchema = z
  .string()
  .regex(/^\d{17,19}$/, 'Invalid Discord Snowflake');

export type DiscordSnowflake = z.infer<typeof DiscordSnowflakeSchema>;

export const AuthorizedUserSchema = z.object({
  id: z.uuid(),
  discordUserId: DiscordSnowflakeSchema,
  username: z.string(),
});
export type AuthorizedUser = z.infer<typeof AuthorizedUserSchema>;

export const MyAccessSchema = z.object({
  user: AuthorizedUserSchema.extend(
    z.object({
      avatarUrl: z.string().nullish(),
    }),
  ),
  appRoles: z.string().array(),
  permissions: PermissionSchema.array(),
});
export type MyAccess = z.infer<typeof MyAccessSchema>;

export const SuccessResponseSchema = z.object({
  allowed: z.literal(true),
  user: AuthorizedUserSchema,
});
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

export const FailReason = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  MISSING_PERMISSION: 'MISSING_PERMISSION',
} as const;

export const FailReasonSchema = z.enum(FailReason);
export type FailReason = (typeof FailReason)[keyof typeof FailReason];

export const FailResponseSchema = z.object({
  allowed: z.literal(false),
  reason: FailReasonSchema.default('UNAUTHENTICATED'),
  permission: PermissionSchema.optional(),
});
export type FailResponse = z.infer<typeof FailResponseSchema>;

export const AuthorizeResponseSchema = z.discriminatedUnion('allowed', [
  SuccessResponseSchema,
  FailResponseSchema,
]);

export type AuthorizeResponse = z.infer<typeof AuthorizeResponseSchema>;
