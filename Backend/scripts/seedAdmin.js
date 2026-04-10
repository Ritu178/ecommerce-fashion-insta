const mysql = require("mysql2/promise");
const { assertDatabaseEnv } = require("../config/loadEnv");
const { hashPassword, isBcryptHash } = require("../utils/passwords");

assertDatabaseEnv();

const databaseName = process.env.DB_NAME;
const adminName = process.env.ADMIN_NAME || "Admin";
const adminEmail = process.env.ADMIN_EMAIL || "admin@fashionista.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const baseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
};

async function run() {
  const connection = await mysql.createConnection(baseConfig);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await connection.query(`USE \`${databaseName}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query(
      "SELECT id FROM admins WHERE email = ? LIMIT 1",
      [adminEmail]
    );

    if (rows.length > 0) {
      const hashedPassword = isBcryptHash(adminPassword)
        ? adminPassword
        : await hashPassword(adminPassword);

      await connection.query(
        "UPDATE admins SET name = ?, password = ? WHERE email = ?",
        [adminName, hashedPassword, adminEmail]
      );
      console.log(`Admin updated: ${adminEmail}`);
      return;
    }

    const hashedPassword = isBcryptHash(adminPassword)
      ? adminPassword
      : await hashPassword(adminPassword);

    await connection.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [adminName, adminEmail, hashedPassword]
    );

    console.log(`Admin created: ${adminEmail}`);
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

run();
