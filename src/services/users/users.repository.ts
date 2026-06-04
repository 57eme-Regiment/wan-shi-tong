import { Database } from '@/infrastructure/database';
import { User } from '@57eme-regiment/auth-contracts/schemas/user.schema';
import { injectable } from 'tsyringe';

/** Contrat d'accès aux données pour les inventaires. */
@injectable()
export class UsersRepository {
  constructor(private readonly db: Database) {}

  /** Retourne un inventaire par son id, ou `null` s'il est introuvable. */
  findByIdOrThrow(id: string): Promise<User | null> {
    return this.db.context.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        disabledAt: true,
        disabledReason: true,
        isSuperAdmin: true,
      },
    });
  }
}
