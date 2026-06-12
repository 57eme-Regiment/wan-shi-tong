import { primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { droit } from '../_schemas';

export const discordUserRole = droit.table(
  'discordUserRole',
  {
    userId: uuid().notNull(),
    guildId: text().notNull(),
    discordRoleId: text().notNull(),
    syncedAt: timestamp({ precision: 3, withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  table => [
    primaryKey({
      columns: [table.userId, table.guildId, table.discordRoleId],
      name: 'discordUserRole_pkey',
    }),
  ],
);
