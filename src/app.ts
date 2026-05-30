import { env } from '@/config/env';
import { errorHandler } from '@/shared/errors/errorHandler';
import cors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';
import Fastify from 'fastify';
import { authorizeRoutes } from './authorize/authorize.routes';
import { logger } from './config/logger';
import { authRoutes } from './lib/auth/betterAuth.route';
import { accessRoutes } from './services/access/access.routes';
import { adminRoutes } from './servicesAdmin/admin.routes';

export function buildApp() {
  const app = Fastify({ logger: { level: 'error' } });

  app.addHook('onRequest', (req, _reply, done) => {
    logger.info(
      `→ reqId:"${req.id}" ${req.method} ${req.url} msg:"incoming request"`,
    );
    done();
  });

  app.addHook('onResponse', (req, reply, done) => {
    logger.info(
      `← reqId:"${req.id}" ${req.method} ${req.url} ${reply.statusCode} ${reply.elapsedTime.toFixed(2)}ms msg:"request completed"`,
    );
    done();
  });

  app.register(cors, {
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  if (env.ALLOWED_HOST) {
    app.addHook('onRequest', (request, reply, done) => {
      const host = request.headers.host ?? '';
      const hostname = host.split(':')[0];
      if (hostname !== env.ALLOWED_HOST) {
        reply.code(404).send();
        return;
      }
      done();
    });
  }

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
