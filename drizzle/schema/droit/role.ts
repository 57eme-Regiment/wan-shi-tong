import { index, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { droit } from '../_schemas';
import { discordRoleMapping } from './discordRoleMapping';
import { rolePermission } from './rolePermission';

export const role = droit.table(
  'role',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    key: text().notNull(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
  },
  table => [
    index('role_key_idx').using(
      'btree',
      table.key.asc().nullsLast().op('text_ops'),
    ),
    uniqueIndex('role_key_key').using(
      'btree',
      table.key.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const roleRelations = relations(role, ({ many }) => ({
  discordRoleMappings: many(discordRoleMapping),
  rolePermissions: many(rolePermission),
}));
