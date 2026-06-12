import {
  boolean,
  index,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { auth } from '../_schemas';
import { account } from './account';
import { session } from './session';

export const user = auth.table(
  'user',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    name: text().notNull(),
    image: text(),
    createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
    disabledAt: timestamp({ precision: 3, withTimezone: true, mode: 'date' }),
    disabledReason: text(),
    isSuperAdmin: boolean().default(false).notNull(),
  },
  table => [
    uniqueIndex('user_email_key').using(
      'btree',
      table.email.asc().nullsLast().op('text_ops'),
    ),
    index('user_name_idx').using(
      'gin',
      table.name.asc().nullsLast().op('gin_trgm_ops'),
    ),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));
