import { Logger } from 'tslog';

/**
 * Crée un logger tslog préconfiguré pour un service donné.
 * Format JSON en production, pretty-print coloré en développement.
 *
 * @example
 * export const logger = createLogger('Renenutet');
 */
export function createLogger(name: string, nodeEnv = process.env.NODE_ENV) {
  return new Logger({
    name,
    type: nodeEnv === 'production' ? 'json' : 'pretty',
    minLevel: nodeEnv === 'production' ? 3 : 0,
    prettyLogTemplate:
      '{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}}\t[{{name}}] ',
    prettyErrorTemplate: '\n{{errorName}} {{errorMessage}}\n{{errorStack}}',
    prettyErrorStackTemplate:
      '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}',
    stylePrettyLogs: true,
  });
}

export type AppLogger = ReturnType<typeof createLogger>;
