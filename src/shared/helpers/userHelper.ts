import type { Database } from '@/infrastructure/database';
import { AppError } from '@57eme-regiment/nabu-errors';

type UserWithDisabled = { disabledAt: Date | null };

/** Charge l'utilisateur ou lève une AppError 404. */
export async function findUserOrThrow(db: Database, userId: string) {
  const user = await db.context.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return user;
}

/** Lève une AppError 403 si le compte est désactivé. */
export function assertEnabled(user: UserWithDisabled): void {
  if (user.disabledAt)
    throw new AppError('Account disabled', 403, 'ACCOUNT_DISABLED');
}

/** Lève une AppError 409 si le compte n'est pas désactivé. */
export function assertDisabled(user: UserWithDisabled): void {
  if (!user.disabledAt)
    throw new AppError('User is not disabled', 409, 'NOT_DISABLED');
}
