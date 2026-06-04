import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { injectable } from 'tsyringe';
import { AdminRoleRepository } from './adminRole.repository';

/** Logique métier pour l'administration des rôles applicatifs. */
@injectable()
export class AdminRoleService {
  constructor(
    private readonly db: Database,
    private readonly repo: AdminRoleRepository,
  ) {}

  /** Retourne tous les rôles existants. */
  getAll() {
    return this.repo.findAll();
  }

  /**
   * Retourne un rôle par son identifiant.
   * @throws {AppError} 404 si le rôle est introuvable.
   */
  async getById(id: string) {
    const role = await this.repo.findById(id);
    if (!role) throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
    return role;
  }

  /** Crée un nouveau rôle applicatif. */
  create(data: { key: string; name: string; description?: string }) {
    return this.repo.create(data);
  }

  /**
   * Met à jour un rôle et invalide tous les snapshots d'accès utilisateurs.
   * @throws {AppError} 404 si le rôle est introuvable.
   */
  async update(
    id: string,
    data: { key?: string; name?: string; description?: string | null },
  ) {
    await this.getById(id);
    const role = await this.repo.update(id, data);
    await this.db.context.userAccessSnapshot.deleteMany({});
    return role;
  }

  /**
   * Retourne les permissions assignées à un rôle.
   * @throws {AppError} 404 si le rôle est introuvable.
   */
  async getPermissions(roleId: string) {
    await this.getById(roleId);
    const links = await this.db.context.rolePermission.findMany({
      where: { roleId },
      include: { permission: { select: { id: true, key: true, description: true } } },
    });
    return links.map((l) => l.permission);
  }

  /**
   * Ajoute une permission à un rôle et invalide les snapshots impactés.
   * @throws {AppError} 404 si le rôle ou la permission est introuvable.
   * @throws {AppError} 409 si la permission est déjà assignée au rôle.
   */
  async addPermission(roleId: string, permissionId: string) {
    await this.getById(roleId);
    const permission = await this.db.context.permission.findUnique({ where: { id: permissionId } });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    const existing = await this.db.context.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
    if (existing) throw new AppError('Permission already assigned to role', 409, 'ALREADY_ASSIGNED');

    await this.db.context.$transaction(async (tx) => {
      await tx.rolePermission.create({ data: { roleId, permissionId } });
      await tx.userAccessSnapshot.deleteMany({});
    });

    return permission;
  }

  /**
   * Retire une permission d'un rôle et invalide les snapshots impactés.
   * @throws {AppError} 404 si le lien rôle-permission est introuvable.
   */
  async removePermission(roleId: string, permissionId: string) {
    const link = await this.db.context.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
    if (!link) throw new AppError('Permission not assigned to this role', 404, 'NOT_ASSIGNED');

    await this.db.context.$transaction(async (tx) => {
      await tx.rolePermission.delete({ where: { roleId_permissionId: { roleId, permissionId } } });
      await tx.userAccessSnapshot.deleteMany({});
    });
  }

  /**
   * Supprime un rôle et invalide tous les snapshots d'accès utilisateurs dans une transaction.
   * @throws {AppError} 404 si le rôle est introuvable.
   */
  async delete(id: string) {
    await this.getById(id);
    await this.db.context.$transaction(async tx => {
      await tx.role.delete({ where: { id } });
      await tx.userAccessSnapshot.deleteMany({});
    });
  }
}
