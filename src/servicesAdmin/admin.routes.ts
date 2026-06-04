import type { FastifyInstance } from 'fastify';
import { adminDiscordMappingRoutes } from './discordMapping/adminDiscordMapping.routes';
import { adminOverrideRoutes } from './overrides/adminOverride.routes';
import { adminPermissionRoutes } from './permissions/adminPermission.routes';
import { adminRoleRoutes } from './roles/adminRole.routes';
import { adminSessionRoutes } from './sessions/adminSession.routes';
import { adminUserRoutes } from './users/adminUser.routes';

/**
 * Enregistre l'ensemble des routes d'administration sous le préfixe /api/admin.
 * Agrège les sous-routeurs suivants :
 *   - /roles           → gestion des rôles
 *   - /permissions     → consultation des permissions
 *   - /discord-mappings → correspondances rôles Discord ↔ rôles internes
 *   - /overrides       → surcharges de permissions par utilisateur
 *   - /users           → actions administratives sur les utilisateurs
 *   - /sessions        → gestion des sessions actives
 */
export async function adminRoutes(app: FastifyInstance) {
  app.register(adminRoleRoutes);
  app.register(adminPermissionRoutes);
  app.register(adminDiscordMappingRoutes);
  app.register(adminOverrideRoutes);
  app.register(adminUserRoutes);
  app.register(adminSessionRoutes);
}
