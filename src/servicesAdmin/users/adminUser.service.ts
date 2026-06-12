import * as schema from '@/../drizzle/schema';
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
import { eq, sql } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class AdminUserService {
  constructor(
    private readonly db: Database,
    private readonly syncRepo: DiscordRoleSyncRepository,
    private readonly syncService: DiscordRoleSyncService,
  ) {}

  async search({ limit, search }: UserQuery) {
    const take = limit ?? 25;

    if (!search) {
      return this.db.context.query.user.findMany({
        columns: {
          id: true,
          name: true,
          image: true,
          disabledAt: true,
          disabledReason: true,
          isSuperAdmin: true,
        },
        limit: take,
        orderBy: (u, { asc }) => [asc(u.name)],
      });
    }

    const threshold = 0.1;
    return this.db.context.execute(sql`
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
    `) as Promise<{
      id: string;
      name: string;
      image: string | null;
      disabledAt: Date | null;
      disabledReason: string | null;
      isSuperAdmin: boolean;
    }[]>;
  }

  getAll() {
    return this.db.context.query.user.findMany({
      orderBy: (u, { asc }) => [asc(u.createdAt)],
      with: {
        sessions: {
          columns: {
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

  async disable(userId: string, reason: string) {
    const user = await findUserOrThrow(this.db, userId);
    assertEnabled(user);
    await this.syncRepo.disableUser(userId, reason);
  }

  async enable(userId: string) {
    const user = await findUserOrThrow(this.db, userId);
    assertDisabled(user);
    await this.db.context
      .update(schema.user)
      .set({ disabledAt: null, disabledReason: null })
      .where(eq(schema.user.id, userId));
  }

  async setSuperAdmin(userId: string, value: boolean) {
    const user = await findUserOrThrow(this.db, userId);
    if (user.isSuperAdmin === value) return;

    await this.db.context.transaction(async tx => {
      await tx.update(schema.user).set({ isSuperAdmin: value }).where(eq(schema.user.id, userId));
      await tx.delete(schema.userAccessSnapshot).where(eq(schema.userAccessSnapshot.userId, userId));
    });
  }

  async syncDiscord(userId: string, guildId: string) {
    const account = await this.db.context.query.account.findFirst({
      where: (a, { and, eq }) =>
        and(eq(a.userId, userId), eq(a.providerId, 'discord')),
      columns: { accessToken: true },
    });
    if (!account?.accessToken)
      throw new AppError('No Discord account linked', 404, 'NO_DISCORD_ACCOUNT');

    await this.syncService.sync(userId, account.accessToken, guildId);
  }
}
