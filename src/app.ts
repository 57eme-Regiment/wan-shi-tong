import { env } from '@/config/env';
import { createErrorHandler } from '@57eme-regiment/nabu-errors';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import {
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';
import apiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { authorizeRoutes } from './authorize/authorize.routes';
import { logger } from './config/logger';
import { authRoutes } from './lib/auth/betterAuth.route';
import { accessRoutes } from './services/access/access.routes';
import { UsersRoutes } from './services/users/users.route';
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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(createErrorHandler(logger));

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

  if (env.NODE_ENV !== 'production') {
    const baseTransform = createJsonSchemaTransform({});
    app.register(fastifySwagger, {
      openapi: {
        info: { title: 'WanShiTong API', version: '1.0.0' },
      },
      transform: document => {
        try {
          return baseTransform(document);
        } catch (err) {
          logger.warn(
            `[swagger] transform failed for ${document.url} — schema hidden. ${err}`,
          );
          return { schema: { hide: true }, url: document.url };
        }
      },
    });
    app.register(apiReference, {
      routePrefix: '/docs',
      configuration: {
        hideClientButton: true,
        hideDarkModeToggle: true,
        hiddenClients: true,
        metaData: {
          title: 'WanShiTong API docs',
        },
        operationTitleSource: 'summary',
        persistAuth: true,
      },
    });
  }

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));
  app.register(UsersRoutes);
  app.register(authRoutes);
  app.register(accessRoutes);
  app.register(adminRoutes);
  app.register(authorizeRoutes);

  app.get('/openapi.json', async (req, res) => {
    return app.swagger();
  });

  return app;
}
