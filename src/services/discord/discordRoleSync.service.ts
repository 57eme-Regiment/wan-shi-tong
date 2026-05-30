import {
  fetchGuildMember,
  type GuildMember,
} from '@/lib/discord/discordClient';
import { inject, injectable } from 'tsyringe';
import { DiscordRoleSyncRepository } from './discord-role-sync.repository';

/** Synchronise les rôles Discord d'un utilisateur depuis l'API Discord vers la base de données. */
@injectable()
export class DiscordRoleSyncService {
  constructor(
    @inject(DiscordRoleSyncRepository)
    private readonly repo: DiscordRoleSyncRepository,
  ) {}

  /**
   * Synchronise les rôles Discord d'un utilisateur.
   * Si l'utilisateur n'est plus membre du serveur (404), désactive son compte.
   * @throws En cas d'erreur non liée à l'appartenance au serveur.
   */
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
