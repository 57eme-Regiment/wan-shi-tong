import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { injectable } from 'tsyringe';

/** Logique métier pour la gestion des permissions applicatives. */
@injectable()
export class AdminPermissionService {
  constructor(private readonly db: Database) {}

  /** Retourne toutes les permissions triées par clé alphabétique. */
  getAll() {
    return this.db.context.permission.findMany({ orderBy: { key: 'asc' } });
  }

  /**
   * Met à jour une permission existante.
   * @throws {AppError} 404 si la permission est introuvable.
   */
  async update(id: string, data: { key?: string; description?: string | null }) {
    const permission = await this.db.context.permission.findUnique({ where: { id } });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    return this.db.context.permission.update({ where: { id }, data });
  }

  /**
   * Crée une nouvelle permission.
   * @throws {AppError} 409 si une permission avec cette clé existe déjà.
   */
  async create(data: { key: string; description?: string }) {
    const existing = await this.db.context.permission.findUnique({
      where: { key: data.key },
    });
    if (existing) throw new AppError('Permission already exists', 409, 'PERMISSION_ALREADY_EXISTS');

    return this.db.context.permission.create({ data });
  }

  /**
   * Supprime une permission par son id.
   * Invalide tous les snapshots (les permissions de rôles peuvent en dépendre).
   * @throws {AppError} 404 si la permission est introuvable.
   */
  async delete(id: string) {
    const permission = await this.db.context.permission.findUnique({ where: { id } });
    if (!permission) throw new AppError('Permission not found', 404, 'PERMISSION_NOT_FOUND');

    await this.db.context.$transaction(async (tx) => {
      await tx.permission.delete({ where: { id } });
      await tx.userAccessSnapshot.deleteMany({});
    });
  }
}
