import { env } from '@/config/env';
import ms from 'ms';
import { inject, injectable } from 'tsyringe';
import {
  resolvePermissions,
  type PermissionResolution,
} from './permissionResolver';
import { PermissionResolverRepository } from './permissionResolver.repository';

/** Résout les permissions effectives d'un utilisateur, avec mise en cache via snapshot. */
@injectable()
export class PermissionResolverService {
  constructor(
    @inject(PermissionResolverRepository)
    private readonly repo: PermissionResolverRepository,
  ) {}

  /**
   * Retourne les permissions et rôles applicatifs d'un utilisateur pour un serveur Discord donné.
   * Utilise le snapshot en cache si celui-ci est encore valide, sinon le recalcule et le persiste.
   */
  async resolveForUser(
    userId: string,
    guildId: string,
  ): Promise<PermissionResolution> {
    const snapshot = await this.repo.getSnapshot(userId);

    if (
      snapshot &&
      Date.now() - snapshot.computedAt.getTime() < ms(env.SESSION_REFRESH_TIME)
    ) {
      return {
        appRoles: snapshot.appRoles,
        permissions: snapshot.permissions,
      };
    }

    const data = await this.repo.loadUserPermissionData(userId, guildId);
    const resolution = resolvePermissions(data);

    await this.repo.upsertSnapshot(
      userId,
      resolution.appRoles,
      data.discordRoleIds,
      resolution.permissions,
    );

    return resolution;
  }
}
