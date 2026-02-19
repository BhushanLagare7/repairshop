import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const sql = neon(databaseUrl);

// Logger
// const db = drizzle(sql, { logger: true });
const db = drizzle(sql);

export { db };
