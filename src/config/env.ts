import 'dotenv/config';
import ms from 'ms';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  ALLOWED_HOST: z.string().optional(),
  CORS_ORIGINS: z
    .string()
    .default('*')
    .transform(val => (val === '*' ? '*' : val.split(',').map(s => s.trim()))),

  //PRisma
  DATABASE_URL: z.url(),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  COOKIE_DOMAIN: z.string(),
  SESSION_REFRESH_TIME: z
    .string()
    .refine(
      (val): val is ms.StringValue => ms(val as ms.StringValue) !== undefined,
      {
        message:
          'SESSION_REFRESH_TIME must be a valid ms duration (e.g. "5s", "10m", "1h")',
      },
    ),

  // Discord OAuth2
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
