import { Logger } from 'tslog';
/**
 * Crée un logger tslog préconfiguré pour un service donné.
 * Format JSON en production, pretty-print coloré en développement.
 *
 * @example
 * export const logger = createLogger('Renenutet');
 */
export declare function createLogger(name: string, nodeEnv?: string | undefined): Logger<unknown>;
export type AppLogger = ReturnType<typeof createLogger>;
//# sourceMappingURL=index.d.ts.map