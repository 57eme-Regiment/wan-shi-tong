import { env } from '@/config/env';
import { errorHandler } from '@/shared/errors/errorHandler';
import cors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';
import Fastify from 'fastify';
import { authorizeRoutes } from './authorize/authorize.routes';
import { authRoutes } from './lib/auth/betterAuth.route';
import { accessRoutes } from './services/access/access.routes';
import { adminRoutes } from './servicesAdmin/admin.routes';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  app.register(cors, {
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));
  app.register(authRoutes);
  app.register(accessRoutes, { prefix: '/access' });
  app.register(adminRoutes, { prefix: '/admin' });
  app.register(authorizeRoutes, { prefix: '/authorize' });

  return app;
}
