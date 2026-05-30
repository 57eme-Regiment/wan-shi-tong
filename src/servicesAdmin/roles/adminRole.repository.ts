import { Database } from '@/infrastructure/database';
import { injectable } from 'tsyringe';

/** Accès aux données Prisma pour le modèle Role (administration). */
@injectable()
export class AdminRoleRepository {
  constructor(private readonly db: Database) {}

  /** Retourne tous les rôles triés par date de création. */
  findAll() {
    return this.db.context.role.findMany({ orderBy: { createdAt: 'asc' } });
  }

  /** Retourne un rôle par son id, ou `null` s'il est introuvable. */
  findById(id: string) {
    return this.db.context.role.findUnique({ where: { id } });
  }

  /** Crée un nouveau rôle avec la clé, le nom et la description optionnelle fournis. */
  create(data: { key: string; name: string; description?: string }) {
    return this.db.context.role.create({ data });
  }

  /** Met à jour les champs d'un rôle existant identifié par son id. */
  update(id: string, data: { key?: string; name?: string; description?: string | null }) {
    return this.db.context.role.update({ where: { id }, data });
  }

  /** Supprime le rôle identifié par son id. */
  delete(id: string) {
    return this.db.context.role.delete({ where: { id } });
  }
}
