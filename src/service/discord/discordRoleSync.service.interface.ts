/** Contrat métier pour la synchronisation des rôles Discord. */
export interface IDiscordRoleSyncService {
  /**
   * Synchronise les rôles Discord d'un utilisateur.
   * Si l'utilisateur n'est plus membre du serveur (404), désactive son compte.
   * @throws En cas d'erreur non liée à l'appartenance au serveur.
   */
  sync(userId: string, accessToken: string, guildId: string): Promise<void>;
}
