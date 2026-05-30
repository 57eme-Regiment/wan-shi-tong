import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';

/** Contrat d'accès aux données pour la synchronisation des rôles Discord. */
@injectable()
export class DiscordRoleSyncRepository {
  constructor(private readonly db: Database) {}

  /** Remplace les rôles Discord d'un utilisateur et invalide son snapshot. */
  async replaceUserRoles(
    userId: string,
    guildId: string,
    roleIds: string[],
  ): Promise<void> {
    await this.db.context.$transaction(async tx => {
      await tx.discordUserRole.deleteMany({ where: { userId, guildId } });

      if (roleIds.length > 0) {
        await tx.discordUserRole.createMany({
          data: roleIds.map(discordRoleId => ({
            userId,
            guildId,
            discordRoleId,
          })),
        });
      }

      await tx.userAccessSnapshot.deleteMany({ where: { userId } });
    });
  }

  /** Désactive un compte utilisateur et révoque ses sessions et snapshot. */
  async disableUser(userId: string, reason: string): Promise<void> {
    await this.db.context.$transaction(async tx => {
      await tx.user.update({
        where: { id: userId },
        data: { disabledAt: new Date(), disabledReason: reason },
      });
      await tx.session.deleteMany({ where: { userId } });
      await tx.userAccessSnapshot.deleteMany({ where: { userId } });
    });
  }
}
