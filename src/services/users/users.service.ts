import { AppError } from '@/shared/errors/appError';
import { User } from '@57eme-regiment/auth-contracts/schemas/user.schema';
import { injectable } from 'tsyringe';
import { UsersRepository } from './users.repository';

/** Service métier pour la consultation des comptes utilisateurs. */
@injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Retourne un utilisateur par son identifiant.
   * @throws {AppError} 404 si l'utilisateur est introuvable.
   */
  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findByIdOrThrow(id);
    if (!user)
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    return user;
  }
}
