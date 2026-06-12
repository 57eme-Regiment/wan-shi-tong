import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class DiscordRoleSyncRepository {
  constructor(private readonly db: Database) {}

  async replaceUserRoles(userId: string, guildId: string, roleIds: string[]): Promise<void> {
    await this.db.context.transaction(async tx => {
      await tx
        .delete(schema.discordUserRole)
        .where(
          and(
            eq(schema.discordUserRole.userId, userId),
            eq(schema.discordUserRole.guildId, guildId),
          ),
        );

      if (roleIds.length > 0) {
        await tx
          .insert(schema.discordUserRole)
          .values(roleIds.map(discordRoleId => ({ userId, guildId, discordRoleId })));
      }

      await tx.delete(schema.userAccessSnapshot).where(eq(schema.userAccessSnapshot.userId, userId));
    });
  }

  async disableUser(userId: string, reason: string): Promise<void> {
    await this.db.context.transaction(async tx => {
      await tx
        .update(schema.user)
        .set({ disabledAt: new Date(), disabledReason: reason })
        .where(eq(schema.user.id, userId));
      await tx.delete(schema.session).where(eq(schema.session.userId, userId));
      await tx.delete(schema.userAccessSnapshot).where(eq(schema.userAccessSnapshot.userId, userId));
    });
  }
}
