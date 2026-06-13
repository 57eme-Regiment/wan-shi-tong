import { Database } from '@/infrastructure/database';
import { User } from '@57eme-regiment/auth-contracts/schemas/user.schema';
import { injectable } from 'tsyringe';

/** Accès aux données Prisma pour le modèle User (consultation publique). */
@injectable()
export class UsersRepository {
  constructor(private readonly db: Database) {}

  async findByIdOrThrow(id: string): Promise<User | null> {
    const user = await this.db.context.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, id),
      columns: {
        id: true,
        name: true,
        image: true,
        disabledAt: true,
        disabledReason: true,
        isSuperAdmin: true,
      },
    });
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  }
}
