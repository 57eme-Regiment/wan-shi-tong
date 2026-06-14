import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { AdminRoleRepository } from './adminRole.repository';

@injectable()
export class AdminRoleService {
  constructor(
    private readonly db: Database,
    private readonly repo: AdminRoleRepository,
  ) {}

  getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    const role = await this.repo.findById(id);
    if (!role) throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
    return role;
  }

  create(data: { key: string; name: string; description?: string }) {
    return this.repo.create(data);
  }

  async update(id: string, data: { key?: string; name?: string; description?: string | null }) {
    await this.getById(id);
    const role = await this.repo.update(id, data);
    await this.db.context.delete(schema.userAccessSnapshot);
    return role;
  }

  async getPermissions(roleId: string) {
    await this.getById(roleId);
    const links = await this.db.context.query.rolePermission.findMany({
      where: (rp, { eq }) => eq(rp.roleId, roleId),
      with: {
        permission: { columns: { id: true, key: true, description: true } },
      },
    });
    return links.map(l => l.permission);
  }

  async addPermission(roleId: string, permissionId: string) {
    await this.getById(roleId);
    const permission = await this.db.context.query.permission.findFirst({
      where: (p, { eq }) => eq(p.id, permissionId),
    });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const existing = await this.db.context.query.rolePermission.findFirst({
      where: (rp, { and, eq }) =>
        and(eq(rp.roleId, roleId), eq(rp.permissionId, permissionId)),
    });
    if (existing) throw new AppError('Permission already assigned to role', 409, 'ALREADY_ASSIGNED');

    await this.db.context.transaction(async tx => {
      await tx.insert(schema.rolePermission).values({ roleId, permissionId });
      await tx.delete(schema.userAccessSnapshot);
    });

    return permission;
  }

  async removePermission(roleId: string, permissionId: string) {
    const link = await this.db.context.query.rolePermission.findFirst({
      where: (rp, { and, eq }) =>
        and(eq(rp.roleId, roleId), eq(rp.permissionId, permissionId)),
    });
    if (!link) throw new AppError('Permission not assigned to this role', 404, 'NOT_ASSIGNED');

    await this.db.context.transaction(async tx => {
      await tx
        .delete(schema.rolePermission)
        .where(
          and(
            eq(schema.rolePermission.roleId, roleId),
            eq(schema.rolePermission.permissionId, permissionId),
          ),
        );
      await tx.delete(schema.userAccessSnapshot);
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.db.context.transaction(async tx => {
      await tx.delete(schema.role).where(eq(schema.role.id, id));
      await tx.delete(schema.userAccessSnapshot);
    });
  }
}
