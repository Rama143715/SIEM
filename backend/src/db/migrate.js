const fs = require("node:fs/promises");
const path = require("node:path");
const db = require("../config/database");

async function ensureMigrationsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getAppliedFilenames() {
  const { rows } = await db.query("SELECT filename FROM schema_migrations");
  return new Set(rows.map((row) => row.filename));
}

async function applyMigration(filename, sql) {
  await db.withTransaction(async (client) => {
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
  });
}

async function run() {
  await ensureMigrationsTable();
  const applied = await getAppliedFilenames();

  const migrationsDir = path.resolve(__dirname, "./migrations");
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, "utf-8");
    await applyMigration(file, sql);
    console.log(`Applied migration: ${file}`);
  }

  console.log("Migrations complete.");
  process.exit(0);
}

run().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});