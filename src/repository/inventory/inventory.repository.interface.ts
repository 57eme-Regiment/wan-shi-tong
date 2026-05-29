import type {
  CreateInventory,
  Inventory,
  UpdateInventory,
} from '@/controller/inventory/inventory.schema';

/** Contrat d'accès aux données pour les inventaires. */
export interface IInventoryRepository {
  /** Retourne tous les inventaires. */
  findAll(): Promise<Inventory[]>;

  /** Retourne un inventaire par son id, ou `null` s'il est introuvable. */
  findById(id: string): Promise<Inventory | null>;

  /** Persiste un nouvel inventaire. */
  create(data: CreateInventory): Promise<Inventory>;

  /** Met à jour les champs d'un inventaire existant. */
  update(id: string, data: UpdateInventory): Promise<Inventory>;

  /** Supprime un inventaire. */
  delete(id: string): Promise<void>;
}
