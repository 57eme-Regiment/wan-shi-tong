export const PRISMA_ERROR_MAP = {
    P2002: { status: 409, error: 'CONFLICT', message: 'A record with this value already exists.' },
    P2025: { status: 404, error: 'NOT_FOUND', message: 'Record not found.' },
    P2003: { status: 400, error: 'FOREIGN_KEY_VIOLATION', message: 'Related record not found.' },
};
