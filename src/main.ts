import 'reflect-metadata';
import '@/infrastructure/container';
import { buildApp } from '@/app';
import { env } from '@/config/env';
import { container } from '@/infrastructure/container';
import { Database } from '@/infrastructure/database';
import { logger } from './config/logger';

async function main() {
  const db = container.resolve(Database);
  await db.connect();

  const app = buildApp();

  await app.listen({ port: env.PORT, host: env.HOST });
  logger.info(
    `Server listening on ${env.ALLOWED_HOST ? env.ALLOWED_HOST : env.HOST}:${env.PORT}`,
  );

  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    await app.close();
    await db.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main().catch(err => {
  logger.fatal(err);
  process.exit(1);
});
