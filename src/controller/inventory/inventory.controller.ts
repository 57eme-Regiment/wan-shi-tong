import type { IInventoryService } from '@/service/inventory/inventory.service.interface';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  CreateInventory,
  InventoryParams,
  UpdateInventory,
} from './inventory.schema';
import { inject, injectable } from 'tsyringe';

/** Contrôleur HTTP pour les opérations CRUD sur les inventaires. */
@injectable()
export class InventoryController {
  constructor(
    @inject('IInventoryService')
    private readonly inventoryService: IInventoryService,
  ) {}

  /** Retourne la liste complète des inventaires. */
  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    const inventories = await this.inventoryService.getAll();
    return reply.send(inventories);
  }

  /**
   * Retourne un inventaire par son id.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  async getById(
    req: FastifyRequest<{ Params: InventoryParams }>,
    reply: FastifyReply,
  ) {
    const inventory = await this.inventoryService.getById(req.params.id);
    return reply.send(inventory);
  }

  /** Crée un nouvel inventaire et retourne la ressource créée (201). */
  async create(
    req: FastifyRequest<{ Body: CreateInventory }>,
    reply: FastifyReply,
  ) {
    const inventory = await this.inventoryService.create(req.body);
    return reply.status(201).send(inventory);
  }

  /**
   * Met à jour un inventaire existant.
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  async update(
    req: FastifyRequest<{ Params: InventoryParams; Body: UpdateInventory }>,
    reply: FastifyReply,
  ) {
    const inventory = await this.inventoryService.update(
      req.params.id,
      req.body,
    );
    return reply.send(inventory);
  }

  /**
   * Supprime un inventaire (204 sans corps).
   * @throws {AppError} 404 si l'inventaire est introuvable.
   */
  async delete(
    req: FastifyRequest<{ Params: InventoryParams }>,
    reply: FastifyReply,
  ) {
    await this.inventoryService.delete(req.params.id);
    return reply.status(204).send();
  }
}
