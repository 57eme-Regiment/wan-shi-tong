import {
  fetchGuildMember,
  type GuildMember,
} from '@/lib/discord/discordClient';
import type { IDiscordRoleSyncRepository } from '@/repository/discord/discord-role-sync.repository.interface';
import { inject, injectable } from 'tsyringe';
import type { IDiscordRoleSyncService } from './discordRoleSync.service.interface';

@injectable()
export class DiscordRoleSyncService implements IDiscordRoleSyncService {
  constructor(
    @inject('IDiscordRoleSyncRepository')
    private readonly repo: IDiscordRoleSyncRepository,
  ) {}

  /** @inheritdoc */
  async sync(
    userId: string,
    accessToken: string,
    guildId: string,
  ): Promise<void> {
    let member: GuildMember;

    try {
      member = await fetchGuildMember(accessToken, guildId);
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;

      if (status === 404) {
        await this.repo.disableUser(
          userId,
          'No longer a member of the Discord server',
        );
        return;
      }

      // Autre erreur (Discord down, token expiré...) → ne pas désactiver, propager
      throw err;
    }

    await this.repo.replaceUserRoles(userId, guildId, member.roles);
  }
}
