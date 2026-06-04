import { Database } from '@/infrastructure/database';
import { User } from '@57eme-regiment/auth-contracts/schemas/user.schema';
import { injectable } from 'tsyringe';

/** Accès aux données Prisma pour le modèle User (consultation publique). */
@injectable()
export class UsersRepository {
  constructor(private readonly db: Database) {}

  /** Retourne un utilisateur par son id, ou lève une erreur s'il est introuvable. */
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
