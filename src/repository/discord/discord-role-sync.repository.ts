import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';
import type { IDiscordRoleSyncRepository } from './discord-role-sync.repository.interface';

@injectable()
export class DiscordRoleSyncRepository implements IDiscordRoleSyncRepository {
  constructor(private readonly db: Database) {}

  /** @inheritdoc */
  async replaceUserRoles(
    userId: string,
    guildId: string,
    roleIds: string[],
  ): Promise<void> {
    await this.db.context.$transaction(async (tx) => {
      await tx.discordUserRole.deleteMany({ where: { userId, guildId } });

      if (roleIds.length > 0) {
        await tx.discordUserRole.createMany({
          data: roleIds.map((discordRoleId) => ({ userId, guildId, discordRoleId })),
        });
      }

      await tx.userAccessSnapshot.deleteMany({ where: { userId } });
    });
  }

  /** @inheritdoc */
  async disableUser(userId: string, reason: string): Promise<void> {
    await this.db.context.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { disabledAt: new Date(), disabledReason: reason },
      });
      await tx.session.deleteMany({ where: { userId } });
      await tx.userAccessSnapshot.deleteMany({ where: { userId } });
    });
  }
}
