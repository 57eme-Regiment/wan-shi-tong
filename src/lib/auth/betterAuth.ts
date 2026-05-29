import { env } from '@/config/env';
import { container } from '@/infrastructure/container';
import { Database } from '@/infrastructure/database';
import { sec } from '@/lib/ms/msHelper';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const { context } = container.resolve(Database);

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: Array.isArray(env.CORS_ORIGINS) ? env.CORS_ORIGINS : ['*'],
  database: prismaAdapter(context, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      disabledAt: {
        type: 'date',
        required: false,
        defaultValue: null,
        input: false,
      },
      disabledReason: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },
  session: {
    expiresIn: sec('6d'),
    updateAge: sec('5s'),
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      disableDefaultScope: true,
      scope: ['identify', 'guilds.members.read'],
    },
  },
});

export type User = typeof auth.$Infer.Session.user;
