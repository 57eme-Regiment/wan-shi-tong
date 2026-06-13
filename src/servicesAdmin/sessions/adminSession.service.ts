import * as schema from '@/../drizzle/schema';
import { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';
import { eq, gt } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class AdminSessionService {
  constructor(private readonly db: Database) {}

  getAll() {
    return this.db.context.query.session.findMany({
      where: (s, { gt }) => gt(s.expiresAt, new Date()),
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });
  }

  async revoke(sessionId: string) {
    const session = await this.db.context.query.session.findFirst({
      where: (s, { eq }) => eq(s.id, sessionId),
    });
    if (!session)
      throw new AppError('Session not found', 404, 'SESSION_NOT_FOUND');
    await this.db.context.delete(schema.session).where(eq(schema.session.id, sessionId));
  }
}
