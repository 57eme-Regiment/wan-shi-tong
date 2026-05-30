import { env } from '@/config/env';
import type { IPermissionResolverRepository } from '@/repository/permission/permissionResolver.repository.interface';
import ms from 'ms';
import { inject, injectable } from 'tsyringe';
import {
  resolvePermissions,
  type PermissionResolution,
} from './permissionResolver';
import type { IPermissionResolverService } from './permissionResolver.service.interface';

@injectable()
export class PermissionResolverService implements IPermissionResolverService {
  constructor(
    @inject('IPermissionResolverRepository')
    private readonly repo: IPermissionResolverRepository,
  ) {}

  /** @inheritdoc */
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
