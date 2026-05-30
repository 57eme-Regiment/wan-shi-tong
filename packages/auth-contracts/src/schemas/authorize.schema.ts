import { z } from 'zod';
import { PermissionSchema } from '../permissions';
import { AuthorizedUserSchema, FailReasonSchema } from '../types';

export const AuthorizeBodySchema = z.object({
  permission: PermissionSchema,
});

export const AuthorizeSuccessSchema = z.object({
  allowed: z.literal(true),
  user: AuthorizedUserSchema,
});

export const AuthorizeFailSchema = z.object({
  allowed: z.literal(false),
  reason: FailReasonSchema,
  permission: PermissionSchema.optional(),
});

export const AuthorizeResponseSchema = z.discriminatedUnion('allowed', [
  AuthorizeSuccessSchema,
  AuthorizeFailSchema,
]);

export type AuthorizeBody = z.infer<typeof AuthorizeBodySchema>;
export type AuthorizeSuccess = z.infer<typeof AuthorizeSuccessSchema>;
export type AuthorizeFail = z.infer<typeof AuthorizeFailSchema>;
export type AuthorizeResponse = z.infer<typeof AuthorizeResponseSchema>;
