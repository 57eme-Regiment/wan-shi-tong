import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { auth } from '../_schemas';

export const verification = auth.table('verification', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ precision: 3, withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp({ precision: 3, withTimezone: true, mode: 'date' }).notNull(),
  updatedAt: timestamp({ precision: 3, withTimezone: true, mode: 'date' }).notNull(),
});
