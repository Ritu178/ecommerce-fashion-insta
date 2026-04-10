const mysql = require("mysql2/promise");
const { assertDatabaseEnv } = require("../config/loadEnv");
const { hashPassword, isBcryptHash } = require("../utils/passwords");

assertDatabaseEnv();

const baseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
};

async function hashTablePasswords(connection, tableName) {
  const [rows] = await connection.query(`SELECT id, password FROM ${tableName}`);
  const pending = (Array.isArray(rows) ? rows : []).filter(
    (row) => row.password && !isBcryptHash(row.password)
  );

  for (const row of pending) {
    const hashed = await hashPassword(row.password);
    await connection.query(`UPDATE ${tableName} SET password = ? WHERE id = ?`, [
      hashed,
      row.id,
    ]);
    console.log(`Hashed ${tableName} password for id=${row.id}`);
  }
}

async function run() {
  const connection = await mysql.createConnection(baseConfig);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    await hashTablePasswords(connection, "users");
    await hashTablePasswords(connection, "admins");

    console.log("Legacy passwords migrated to bcrypt hashes.");
  } catch (error) {
    console.error("Password hash migration failed:", error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

run();
