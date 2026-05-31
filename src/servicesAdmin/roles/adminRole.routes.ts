import { container } from '@/infrastructure/container';
import {
  AddRolePermissionSchema,
  AdminErrorSchema,
  AdminRoleSchema,
  CreateRoleSchema,
  RoleParamsSchema,
  RolePermissionItemSchema,
  RolePermissionParamsSchema,
  UpdateRoleSchema,
} from '@57eme-regiment/auth-contracts';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminRoleController } from './adminRole.controller';

/**
 * Enregistre les routes CRUD pour les rôles sous le préfixe /api/admin/roles.
 * Toutes les routes utilisent la validation Zod via ZodTypeProvider.
 */
export async function adminRoleRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(AdminRoleController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  /** Retourne la liste de tous les rôles. */
  server.get('/', {
    schema: { response: { 200: z.array(AdminRoleSchema), 401: AdminErrorSchema, 403: AdminErrorSchema } },
  }, ctrl.getAll.bind(ctrl));

  /** Crée un nouveau rôle. */
  server.post('/', {
    schema: { body: CreateRoleSchema, response: { 201: AdminRoleSchema, 401: AdminErrorSchema, 403: AdminErrorSchema } },
  }, ctrl.create.bind(ctrl));

  /** Met à jour un rôle existant identifié par son id. */
  server.put('/:id', {
    schema: {
      params: RoleParamsSchema,
      body: UpdateRoleSchema,
      response: { 200: AdminRoleSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.update.bind(ctrl));

  /** Supprime un rôle identifié par son id. */
  server.delete('/:id', {
    schema: {
      params: RoleParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.delete.bind(ctrl));

  /** Retourne les permissions assignées à un rôle. */
  server.get('/:roleId/permissions', {
    schema: {
      params: z.object({ roleId: z.string() }),
      response: { 200: z.array(RolePermissionItemSchema), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.getPermissions.bind(ctrl));

  /** Ajoute une permission à un rôle. */
  server.post('/:roleId/permissions', {
    schema: {
      params: z.object({ roleId: z.string() }),
      body: AddRolePermissionSchema,
      response: { 201: RolePermissionItemSchema, 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema, 409: AdminErrorSchema },
    },
  }, ctrl.addPermission.bind(ctrl));

  /** Retire une permission d'un rôle. */
  server.delete('/:roleId/permissions/:permissionId', {
    schema: {
      params: RolePermissionParamsSchema,
      response: { 204: z.null(), 401: AdminErrorSchema, 403: AdminErrorSchema, 404: AdminErrorSchema },
    },
  }, ctrl.removePermission.bind(ctrl));
}
