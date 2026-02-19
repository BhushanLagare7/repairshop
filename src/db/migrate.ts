import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "./index";

async function main() {
  try {
    await migrate(db, { migrationsFolder: "src/db/migrations" });
    console.log("Migration successful");
  } catch (error) {
    console.error("Migration failed", error);
    process.exit(1);
  }
}

main();
