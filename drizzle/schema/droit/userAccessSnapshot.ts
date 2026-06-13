import { jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { droit } from '../_schemas';

export const userAccessSnapshot = droit.table('userAccessSnapshot', {
  userId: uuid().primaryKey().notNull(),
  appRoles: jsonb().notNull(),
  discordRoles: jsonb().notNull(),
  permissions: jsonb().notNull(),
  computedAt: timestamp({ precision: 3, withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
});
