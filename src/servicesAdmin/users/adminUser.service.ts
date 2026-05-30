import { Database } from '@/infrastructure/database';
import { DiscordRoleSyncRepository } from '@/services/discord/discord-role-sync.repository';
import { DiscordRoleSyncService } from '@/services/discord/discordRoleSync.service';
import { AppError } from '@/shared/errors/appError';
import {
  assertDisabled,
  assertEnabled,
  findUserOrThrow,
} from '@/shared/helpers/userHelper';
import { injectable } from 'tsyringe';

/** Logique métier pour l'administration des utilisateurs (activation, désactivation, synchronisation Discord). */
@injectable()
export class AdminUserService {
  constructor(
    private readonly db: Database,
    private readonly syncRepo: DiscordRoleSyncRepository,
    private readonly syncService: DiscordRoleSyncService,
  ) {}

  /**
   * Désactive un utilisateur avec un motif et invalide ses données de synchronisation.
   * @throws {AppError} 404 si l'utilisateur est introuvable ou déjà désactivé.
   */
  async disable(userId: string, reason: string) {
    const user = await findUserOrThrow(this.db, userId);
    assertEnabled(user);
    await this.syncRepo.disableUser(userId, reason);
  }

  /**
   * Réactive un utilisateur précédemment désactivé.
   * @throws {AppError} 404 si l'utilisateur est introuvable ou déjà actif.
   */
  async enable(userId: string) {
    const user = await findUserOrThrow(this.db, userId);
    assertDisabled(user);
    await this.db.context.user.update({
      where: { id: userId },
      data: { disabledAt: null, disabledReason: null },
    });
  }

  /**
   * Déclenche la synchronisation des rôles Discord pour un utilisateur sur un serveur donné.
   * @throws {AppError} 404 si aucun compte Discord n'est lié à l'utilisateur.
   */
  async syncDiscord(userId: string, guildId: string) {
    const account = await this.db.context.account.findFirst({
      where: { userId, providerId: 'discord' },
      select: { accessToken: true },
    });
    if (!account?.accessToken)
      throw new AppError(
        'No Discord account linked',
        404,
        'NO_DISCORD_ACCOUNT',
      );

    await this.syncService.sync(userId, account.accessToken, guildId);
  }
}
