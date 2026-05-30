import { z } from 'zod';
import { DiscordSnowflakeSchema } from '../types';

export const AccessUserSchema = z.object({
  id: z.string().min(1),
  discordUserId: DiscordSnowflakeSchema,
  username: z.string(),
  avatarUrl: z.string().nullish(),
});

export const AccessMeResponseSchema = z.object({
  user: AccessUserSchema,
  appRoles: z.string().array(),
  permissions: z.string().array(),
});

export type AccessUser = z.infer<typeof AccessUserSchema>;
export type AccessMeResponse = z.infer<typeof AccessMeResponseSchema>;
