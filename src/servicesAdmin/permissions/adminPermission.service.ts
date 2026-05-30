import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';

/** Logique métier pour la consultation des permissions disponibles. */
@injectable()
export class AdminPermissionService {
  constructor(private readonly db: Database) {}

  /** Retourne toutes les permissions triées par clé alphabétique. */
  getAll() {
    return this.db.context.permission.findMany({ orderBy: { key: 'asc' } });
  }
}
