const fs = require("fs").promises;
const path = require("path");
const mysql = require("mysql2/promise");
const { assertDatabaseEnv } = require("../config/loadEnv");

assertDatabaseEnv();

const migrationsDir = path.join(__dirname, "..", "migrations");
const databaseName = process.env.DB_NAME;

const baseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
};

async function ensureDatabase(connection) {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await connection.query(`USE \`${databaseName}\``);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getMigrationFiles() {
  const entries = await fs.readdir(migrationsDir);
  return entries.filter((file) => file.endsWith(".sql")).sort();
}

async function run() {
  const connection = await mysql.createConnection(baseConfig);

  try {
    await ensureDatabase(connection);

    const [rows] = await connection.query(
      "SELECT filename FROM schema_migrations ORDER BY filename"
    );
    const applied = new Set(rows.map((row) => row.filename));
    const files = await getMigrationFiles();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping ${file}`);
        continue;
      }

      const fullPath = path.join(migrationsDir, file);
      const sql = await fs.readFile(fullPath, "utf8");

      console.log(`Applying ${file}`);
      await connection.beginTransaction();
      await connection.query(sql);
      await connection.query(
        "INSERT INTO schema_migrations (filename) VALUES (?)",
        [file]
      );
      await connection.commit();
    }

    console.log("Migrations complete.");
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      // Ignore rollback errors after failed setup/query phases.
    }
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

run();
