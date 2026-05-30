import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';
import type {
  IPermissionResolverRepository,
  SnapshotData,
  UserPermissionData,
} from './permissionResolver.repository.interface';

@injectable()
export class PermissionResolverRepository implements IPermissionResolverRepository {
  constructor(private readonly db: Database) {}

  /** @inheritdoc */
  async loadUserPermissionData(
    userId: string,
    guildId: string,
  ): Promise<UserPermissionData> {
    // 1. Rôles Discord de l'utilisateur sur ce serveur
    const userRoles = await this.db.context.discordUserRole.findMany({
      where: { userId, guildId },
      select: { discordRoleId: true },
    });
    const discordRoleIds = userRoles.map(r => r.discordRoleId);

    // 2. Mappings Discord → AppRole pour ces rôles
    const mappings = await this.db.context.discordRoleMapping.findMany({
      where: { guildId, discordRoleId: { in: discordRoleIds } },
      select: { discordRoleId: true, role: { select: { key: true } } },
    });

    // 3. AppRole → Permission pour les rôles applicatifs trouvés
    const roleKeys = [...new Set(mappings.map(m => m.role.key))];
    const rolePermissions = await this.db.context.rolePermission.findMany({
      where: { role: { key: { in: roleKeys } } },
      select: {
        role: { select: { key: true } },
        permission: { select: { key: true } },
      },
    });

    // 4. Overrides manuels de l'utilisateur
    const overrides = await this.db.context.userPermissionOverride.findMany({
      where: { userId },
      select: {
        effect: true,
        permission: { select: { key: true } },
      },
    });

    return { discordRoleIds, mappings, rolePermissions, overrides };
  }

  /** @inheritdoc */
  async getSnapshot(userId: string): Promise<SnapshotData | null> {
    const snap = await this.db.context.userAccessSnapshot.findUnique({
      where: { userId },
    });

    if (!snap) return null;

    return {
      appRoles: snap.appRoles as string[],
      discordRoles: snap.discordRoles as string[],
      permissions: snap.permissions as string[],
      computedAt: snap.computedAt,
    };
  }

  /** @inheritdoc */
  async upsertSnapshot(
    userId: string,
    appRoles: string[],
    discordRoles: string[],
    permissions: string[],
  ): Promise<void> {
    await this.db.context.userAccessSnapshot.upsert({
      where: { userId },
      update: { appRoles, discordRoles, permissions, computedAt: new Date() },
      create: { userId, appRoles, discordRoles, permissions },
    });
  }
}
