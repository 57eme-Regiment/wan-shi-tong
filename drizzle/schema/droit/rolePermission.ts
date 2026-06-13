import { foreignKey, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { droit } from '../_schemas';
import { permission } from './permission';
import { role } from './role';

export const rolePermission = droit.table(
  'rolePermission',
  {
    roleId: uuid().notNull(),
    permissionId: uuid().notNull(),
  },
  table => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [role.id],
      name: 'rolePermission_roleId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permission.id],
      name: 'rolePermission_permissionId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.roleId, table.permissionId],
      name: 'rolePermission_pkey',
    }),
  ],
);

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
  role: one(role, {
    fields: [rolePermission.roleId],
    references: [role.id],
  }),
  permission: one(permission, {
    fields: [rolePermission.permissionId],
    references: [permission.id],
  }),
}));
