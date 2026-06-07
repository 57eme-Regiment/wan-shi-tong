import { Database } from '@/infrastructure/database';
import { DiscordRoleSyncRepository } from '@/services/discord/discord-role-sync.repository';
import { DiscordRoleSyncService } from '@/services/discord/discordRoleSync.service';
import {
  assertDisabled,
  assertEnabled,
  findUserOrThrow,
} from '@/shared/helpers/userHelper';
import { UserQuery } from '@57eme-regiment/auth-contracts';
import { AppError } from '@57eme-regiment/nabu-errors';
import { injectable } from 'tsyringe';

/** Logique métier pour l'administration des utilisateurs (activation, désactivation, synchronisation Discord). */
@injectable()
export class AdminUserService {
  constructor(
    private readonly db: Database,
    private readonly syncRepo: DiscordRoleSyncRepository,
    private readonly syncService: DiscordRoleSyncService,
  ) {}

  /** Recherche des utilisateurs par nom (fuzzy) ou accountId (ILIKE). */
  async search({ limit, search }: UserQuery) {
    const take = limit ?? 25;

    if (!search) {
      return this.db.context.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          disabledAt: true,
          disabledReason: true,
          isSuperAdmin: true,
        },
        take,
        orderBy: { name: 'asc' },
      });
    }

    const threshold = 0.1;
    return this.db.context.$queryRaw<
      {
        id: string;
        name: string;
        image: string | null;
        disabledAt: Date | null;
        disabledReason: string | null;
        isSuperAdmin: boolean;
      }[]
    >`
      SELECT DISTINCT u.id, u.name, u.image, u."disabledAt", u."disabledReason", u."isSuperAdmin",
        similarity(u.name, ${search}) AS score
      FROM "auth"."user" u
      LEFT JOIN "auth".account a ON a."userId" = u.id
      WHERE
        similarity(u.name, ${search}) > ${threshold}
        OR u.name ILIKE ${'%' + search + '%'}
        OR a."accountId" ILIKE ${'%' + search + '%'}
      ORDER BY score DESC
      LIMIT ${take}
    `;
  }

  /** Retourne tous les utilisateurs avec leurs sessions actives. */
  getAll() {
    return this.db.context.user.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        sessions: {
          select: {
            id: true,
            userId: true,
            expiresAt: true,
            createdAt: true,
            ipAddress: true,
            userAgent: true,
          },
        },
      },
    });
  }

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
   * Active ou désactive le statut super admin d'un utilisateur.
   * Invalide le snapshot de permissions si le statut change.
   * @throws {AppError} 404 si l'utilisateur est introuvable.
   */
  async setSuperAdmin(userId: string, value: boolean) {
    const user = await findUserOrThrow(this.db, userId);
    if (user.isSuperAdmin === value) return;

    await this.db.context.$transaction(async tx => {
      await tx.user.update({
        where: { id: userId },
        data: { isSuperAdmin: value },
      });
      await tx.userAccessSnapshot.deleteMany({ where: { userId } });
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
