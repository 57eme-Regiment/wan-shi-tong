import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { injectable } from 'tsyringe';

/** Logique métier pour l'administration des sessions utilisateurs actives. */
@injectable()
export class AdminSessionService {
  constructor(private readonly db: Database) {}

  /** Retourne toutes les sessions non expirées, triées par date de création décroissante. */
  getAll() {
    return this.db.context.session.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Révoque (supprime) une session par son identifiant.
   * @throws {AppError} 404 si la session est introuvable.
   */
  async revoke(sessionId: string) {
    const session = await this.db.context.session.findUnique({
      where: { id: sessionId },
    });
    if (!session)
      throw new AppError('Session not found', 404, 'SESSION_NOT_FOUND');
    await this.db.context.session.delete({ where: { id: sessionId } });
  }
}
