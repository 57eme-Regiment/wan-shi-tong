import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { and, eq, inArray } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import type {
  SnapshotData,
  UserPermissionData,
} from './permissionResolver.schema';

@injectable()
export class PermissionResolverRepository {
  constructor(private readonly db: Database) {}

  async loadUserPermissionData(
    userId: string,
    guildId: string,
  ): Promise<UserPermissionData> {
    // 1. Rôles Discord de l'utilisateur sur ce serveur
    const userRoles = await this.db.context.query.discordUserRole.findMany({
      where: (r, { and, eq }) => and(eq(r.userId, userId), eq(r.guildId, guildId)),
      columns: { discordRoleId: true },
    });
    const discordRoleIds = userRoles.map(r => r.discordRoleId);

    // 2. Mappings Discord → AppRole pour ces rôles
    const mappings = discordRoleIds.length > 0
      ? await this.db.context.query.discordRoleMapping.findMany({
          where: (m, { and, eq, inArray }) =>
            and(eq(m.guildId, guildId), inArray(m.discordRoleId, discordRoleIds)),
          columns: { discordRoleId: true },
          with: { role: { columns: { key: true } } },
        })
      : [];

    // 3. AppRole → Permission pour les rôles applicatifs trouvés
    const roleKeys = [...new Set(mappings.map(m => m.role.key))];
    const rolePermissions = roleKeys.length > 0
      ? (await this.db.context
          .select({
            roleKey: schema.role.key,
            permissionKey: schema.permission.key,
          })
          .from(schema.rolePermission)
          .innerJoin(schema.role, eq(schema.rolePermission.roleId, schema.role.id))
          .innerJoin(schema.permission, eq(schema.rolePermission.permissionId, schema.permission.id))
          .where(inArray(schema.role.key, roleKeys))
        ).map(rp => ({ role: { key: rp.roleKey }, permission: { key: rp.permissionKey } }))
      : [];

    // 4. Overrides manuels de l'utilisateur
    const overrides = await this.db.context.query.userPermissionOverride.findMany({
      where: (o, { eq }) => eq(o.userId, userId),
      columns: { effect: true },
      with: { permission: { columns: { key: true } } },
    });

    return { discordRoleIds, mappings, rolePermissions, overrides };
  }

  async getSnapshot(userId: string): Promise<SnapshotData | null> {
    const snap = await this.db.context.query.userAccessSnapshot.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });

    if (!snap) return null;

    return {
      appRoles: snap.appRoles as string[],
      discordRoles: snap.discordRoles as string[],
      permissions: snap.permissions as string[],
      computedAt: snap.computedAt,
    };
  }

  async upsertSnapshot(
    userId: string,
    appRoles: string[],
    discordRoles: string[],
    permissions: string[],
  ): Promise<void> {
    await this.db.context
      .insert(schema.userAccessSnapshot)
      .values({ userId, appRoles, discordRoles, permissions })
      .onConflictDoUpdate({
        target: schema.userAccessSnapshot.userId,
        set: { appRoles, discordRoles, permissions, computedAt: new Date() },
      });
  }
}
