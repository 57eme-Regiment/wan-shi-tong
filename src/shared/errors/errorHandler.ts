import { Prisma } from '@/generated/client';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './appError';
import { PRISMA_ERROR_MAP } from './prismaErrorMap';

export function errorHandler(
  error: FastifyError | unknown,
  req: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.code ?? error.name,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

  req.log.error(error);
  return reply
    .status(500)
    .send({ error: 'INTERNAL_ERROR', message: 'Internal server error' });
}
