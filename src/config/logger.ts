import { env } from '@/config/env';
import { Logger } from 'tslog';

export const logger = new Logger({
  name: 'WanShiTong',
  type: env.NODE_ENV === 'production' ? 'json' : 'pretty',
  minLevel: env.NODE_ENV === 'production' ? 3 : 0, // 0=silly, 3=info in prod
  prettyLogTemplate:
    '{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}}\t[{{name}}] ',
  prettyErrorTemplate: '\n{{errorName}} {{errorMessage}}\n{{errorStack}}',
  prettyErrorStackTemplate:
    '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}',
  stylePrettyLogs: true,
});
