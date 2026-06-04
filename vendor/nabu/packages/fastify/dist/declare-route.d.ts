import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
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
    metadata?: {
        tags?: string[];
    };
};
type ZodServer = FastifyInstance<any, any, any, any, ZodTypeProvider>;
/**
 * Enregistre une route Fastify à partir d'un endpoint de contrat ts-rest.
 * Mappe automatiquement `method`, `path`, `body`, `pathParams` et `responses`.
 *
 * @example
 * declareRoute(server, inventoryContract.getAll, ctrl.getAll.bind(ctrl));
 */
export declare function declareRoute(server: ZodServer, contract: ContractEndpoint, handler: (req: FastifyRequest<any>, reply: FastifyReply) => void | Promise<any>, options?: Omit<RouteShorthandOptions, 'schema'>): void;
export {};
//# sourceMappingURL=declare-route.d.ts.map