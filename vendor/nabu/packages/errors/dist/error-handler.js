import { ZodError } from 'zod';
import { AppError } from './app-error.js';
import { PRISMA_ERROR_MAP } from './prisma-error-map.js';
/** Duck-type check for Prisma's PrismaClientKnownRequestError — avoids importing generated client. */
function isPrismaKnownError(e) {
    return (e != null &&
        typeof e === 'object' &&
        'code' in e &&
        typeof e.code === 'string' &&
        (e.constructor?.name === 'PrismaClientKnownRequestError' ||
            e.name === 'PrismaClientKnownRequestError'));
}
/**
 * Crée un handler d'erreur Fastify préconfiguré.
 * Gère AppError, les erreurs Prisma connues et les erreurs de validation Zod.
 *
 * @example
 * app.setErrorHandler(createErrorHandler(logger));
 */
export function createErrorHandler(logger) {
    return function errorHandler(error, req, reply) {
        logger.error(`${req.id} ${req.method} ${req.url}`, error);
        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({
                error: error.code ?? error.name,
                message: error.message,
            });
        }
        if (isPrismaKnownError(error)) {
            const mapped = PRISMA_ERROR_MAP[error.code];
            if (mapped) {
                return reply
                    .status(mapped.status)
                    .send({ error: mapped.error, message: mapped.message });
            }
            req.log.error(error);
            return reply
                .status(500)
                .send({ error: 'DATABASE_ERROR', message: 'Unexpected database error.' });
        }
        if (error instanceof ZodError) {
            return reply.status(422).send({
                error: 'VALIDATION_ERROR',
                message: error.issues
                    .map(i => `${i.path.join('.')}: ${i.message}`)
                    .join(', '),
            });
        }
        if (error instanceof Error && 'validation' in error) {
            return reply.status(422).send({
                error: 'VALIDATION_ERROR',
                message: error.message,
            });
        }
        return reply
            .status(500)
            .send({ error: 'INTERNAL_ERROR', message: 'Internal server error' });
    };
}
