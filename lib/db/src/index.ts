import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema/index.ts";

const { Pool } = pg;

// Mock DATABASE_URL if it's not provided to allow server to start for UI preview
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/mock_db";

export const pool = new Pool({ connectionString });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
