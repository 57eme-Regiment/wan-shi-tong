import { foreignKey, index, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { auth } from '../_schemas';
import { user } from './user';

export const account = auth.table(
  'account',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ precision: 3, mode: 'date' }),
    refreshTokenExpiresAt: timestamp({ precision: 3, mode: 'date' }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
  },
  table => [
    index('account_accountId_idx').using(
      'gin',
      table.accountId.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('account_userId_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'account_userId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const accountRelations = relations(account, ({ one }) => ({
  userInAuth: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
