import {
  foreignKey,
  index,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { auth } from '../_schemas';
import { user } from './user';

export const session = auth.table(
  'session',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    expiresAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: uuid().notNull(),
  },
  table => [
    uniqueIndex('session_token_key').using(
      'btree',
      table.token.asc().nullsLast().op('text_ops'),
    ),
    index('session_userId_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'session_userId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
