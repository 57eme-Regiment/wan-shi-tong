import { foreignKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { droit } from '../_schemas';
import { role } from './role';

export const discordRoleMapping = droit.table(
  'discordRoleMapping',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    guildId: text().notNull(),
    discordRoleId: text().notNull(),
    roleId: uuid().notNull(),
  },
  table => [
    uniqueIndex('discordRoleMapping_guildId_discordRoleId_roleId_key').using(
      'btree',
      table.guildId.asc().nullsLast().op('text_ops'),
      table.discordRoleId.asc().nullsLast().op('text_ops'),
      table.roleId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [role.id],
      name: 'discordRoleMapping_roleId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const discordRoleMappingRelations = relations(
  discordRoleMapping,
  ({ one }) => ({
    role: one(role, {
      fields: [discordRoleMapping.roleId],
      references: [role.id],
    }),
  }),
);
