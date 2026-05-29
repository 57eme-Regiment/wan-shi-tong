import type {
  CreateInventory,
  Inventory,
  UpdateInventory,
} from '@/controller/inventory/inventory.schema';

/** Contrat métier pour la gestion des inventaires. */
export interface IInventoryService {
  /** Retourne tous les inventaires. */
  getAll(): Promise<Inventory[]>;

  /**
   * Retourne un inventaire par son identifiant.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  getById(id: string): Promise<Inventory>;

  /** Crée un nouvel inventaire. */
  create(data: CreateInventory): Promise<Inventory>;

  /**
   * Met à jour un inventaire existant.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  update(id: string, data: UpdateInventory): Promise<Inventory>;

  /**
   * Supprime un inventaire.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  delete(id: string): Promise<void>;
}
