import { foreignKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { droit } from '../_schemas';
import { permission } from './permission';

export const overrideEffect = droit.enum('OverrideEffect', ['allow', 'deny']);

export const userPermissionOverride = droit.table(
  'userPermissionOverride',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    userId: uuid().notNull(),
    permissionId: uuid().notNull(),
    effect: overrideEffect().notNull(),
    reason: text(),
    createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
  },
  table => [
    uniqueIndex('userPermissionOverride_userId_permissionId_key').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
      table.permissionId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permission.id],
      name: 'userPermissionOverride_permissionId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const userPermissionOverrideRelations = relations(
  userPermissionOverride,
  ({ one }) => ({
    permission: one(permission, {
      fields: [userPermissionOverride.permissionId],
      references: [permission.id],
    }),
  }),
);
