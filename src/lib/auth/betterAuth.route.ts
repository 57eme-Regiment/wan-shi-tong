import { env } from '@/config/env';
import type { FastifyInstance } from 'fastify';
import { auth } from './betterAuth';

export async function authRoutes(app: FastifyInstance) {
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
    done(null, body);
  });

  app.all('/auth/*', async (request, reply) => {
    const url = new URL(request.url, env.BETTER_AUTH_URL);
    const headers = new Headers(request.headers as Record<string, string>);
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

    const webRequest = new Request(url.toString(), {
      method: request.method,
      headers,
      body: hasBody ? (request.body as string) : undefined,
    });

    const response = await auth.handler(webRequest);

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    return reply.send(await response.text());
  });
}
