import { index, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { droit } from '../_schemas';
import { rolePermission } from './rolePermission';
import { userPermissionOverride } from './userPermissionOverride';

export const permission = droit.table(
  'permission',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    key: text().notNull(),
    description: text(),
    createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
  },
  table => [
    index('permission_key_idx').using(
      'btree',
      table.key.asc().nullsLast().op('text_ops'),
    ),
    uniqueIndex('permission_key_key').using(
      'btree',
      table.key.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const permissionRelations = relations(permission, ({ many }) => ({
  userPermissionOverrides: many(userPermissionOverride),
  rolePermissions: many(rolePermission),
}));
