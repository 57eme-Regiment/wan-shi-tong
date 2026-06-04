import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from 'fastify';
import type { ZodType } from 'zod';
import type { HttpMethod } from './http-method.js';

export type ContractEndpoint = {
  method: HttpMethod;
  path: string;
  body?: ZodType | symbol;
  pathParams?: ZodType;
  responses: Record<number, ZodType>;
  summary?: string;
  description?: string;
  metadata?: { tags?: string[] };
};

type ZodServer = FastifyInstance<any, any, any, any, ZodTypeProvider>;

/**
 * Enregistre une route Fastify à partir d'un endpoint de contrat ts-rest.
 * Mappe automatiquement `method`, `path`, `body`, `pathParams` et `responses`.
 *
 * @example
 * declareRoute(server, inventoryContract.getAll, ctrl.getAll.bind(ctrl));
 */
export function declareRoute(
  server: ZodServer,
  contract: ContractEndpoint,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: FastifyRequest<any>, reply: FastifyReply) => void | Promise<any>,
  options?: Omit<RouteShorthandOptions, 'schema'>,
): void {
  const method = contract.method.toLowerCase() as Lowercase<HttpMethod>;

  const schema: Record<string, unknown> = { response: contract.responses };
  if (contract.body && typeof contract.body !== 'symbol') schema.body = contract.body;
  if (contract.pathParams) schema.params = contract.pathParams;
  if (contract.summary) schema.summary = contract.summary;
  if (contract.description) schema.description = contract.description;
  if (contract.metadata?.tags) schema.tags = contract.metadata.tags;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (server[method] as any)(contract.path, { ...options, schema }, handler);
}
