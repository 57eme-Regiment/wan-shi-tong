import 'dotenv/config'; // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  schema: './drizzle/schema',
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      (() => {
        throw new Error('Invalide env var : DATABASE_URL');
      })(),
  },
  schemaFilter: ['auth', 'droit'],
  verbose: true,
  strict: true,
});
