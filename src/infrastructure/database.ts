import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/client';
import { injectable } from 'tsyringe';

@injectable()
export class Database {
  readonly context: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    const globalForPrisma = global as unknown as {
      prisma: PrismaClient;
    };

    const context =
      globalForPrisma.prisma ||
      new PrismaClient({
        adapter,
      });

    this.context = context;
  }

  async connect(): Promise<void> {
    await this.context.$connect();
  }

  async disconnect(): Promise<void> {
    await this.context.$disconnect();
  }
}
