import { Database } from '@/infrastructure/database';
import { AppError } from '@/shared/errors/appError';
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
