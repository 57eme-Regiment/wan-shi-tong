import type { PermissionResolution } from './permissionResolver';

/** Contrat métier pour la résolution des permissions utilisateur. */
export interface IPermissionResolverService {
  /**
   * Retourne les permissions effectives d'un utilisateur.
   * Utilise le snapshot si valide (< 5m), recalcule sinon.
   */
  resolveForUser(userId: string, guildId: string): Promise<PermissionResolution>;
}
