import { z } from 'zod';

export const ErrorSchema = z.object({ code: z.string() });

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url().nullish(),
  disabledAt: z.date().nullish(),
  disabledReason: z.string().nullish(),
  isSuperAdmin: z.boolean().default(false),
});
export type User = z.infer<typeof UserSchema>;

export const UserParamsSchema = z.object({ userId: z.string() });
export type UserParams = z.infer<typeof UserParamsSchema>;
export const UserQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().optional(),
});
export type UserQuery = z.infer<typeof UserQuerySchema>;
