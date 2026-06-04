import type { FastifyReply, FastifyRequest } from 'fastify';
type SimpleLogger = {
    error: (...args: unknown[]) => void;
};
/**
 * Crée un handler d'erreur Fastify préconfiguré.
 * Gère AppError, les erreurs Prisma connues et les erreurs de validation Zod.
 *
 * @example
 * app.setErrorHandler(createErrorHandler(logger));
 */
export declare function createErrorHandler(logger: SimpleLogger): (error: unknown, req: FastifyRequest, reply: FastifyReply) => FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
export {};
//# sourceMappingURL=error-handler.d.ts.map