import * as schema from '@/../drizzle/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { injectable } from 'tsyringe';

export type DrizzleContext = ReturnType<typeof drizzle<typeof schema>>;

@injectable()
export class Database {
  readonly context: DrizzleContext;
  private readonly client: postgres.Sql;

  constructor() {
    this.client = postgres(process.env.DATABASE_URL!);
    this.context = drizzle(this.client, { schema });
  }

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {
    await this.client.end();
  }
}
