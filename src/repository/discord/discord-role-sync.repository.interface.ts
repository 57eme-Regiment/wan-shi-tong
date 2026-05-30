/** Contrat d'accès aux données pour la synchronisation des rôles Discord. */
export interface IDiscordRoleSyncRepository {
  /** Remplace les rôles Discord d'un utilisateur et invalide son snapshot. */
  replaceUserRoles(userId: string, guildId: string, roleIds: string[]): Promise<void>;

  /** Désactive un compte utilisateur et révoque ses sessions et snapshot. */
  disableUser(userId: string, reason: string): Promise<void>;
}
