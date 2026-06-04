import { AppError } from '@/shared/errors/appError';
import { injectable } from 'tsyringe';
import { UsersRepository } from './users.repository';

/** Service métier pour la gestion des inventaires. */
@injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Retourne un inventaire et tout ces details par son identifiant.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  async getById(id: string): Promise<InventoryDetails> {
    const user = await this.usersRepository.findByIdOrThrow(id);
    if (!user)
      throw new AppError('Inventory not found', 404, 'INVENTORY_NOT_FOUND');

    return user;
  }
}
