const mysql = require("mysql2");
const { assertDatabaseEnv } = require("./config/loadEnv");

assertDatabaseEnv();

const baseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const databaseName = process.env.DB_NAME;

const db = mysql.createPool({
  ...baseConfig,
  database: databaseName,
});

const ensureDatabaseExists = () => {
  const setupConnection = mysql.createConnection(baseConfig);

  setupConnection.connect((connectErr) => {
    if (connectErr) {
      console.log("DB Setup Error:", connectErr);
      return;
    }

    setupConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\``,
      (createErr) => {
        if (createErr) {
          console.log("DB Create Error:", createErr);
          setupConnection.end();
          return;
        }

        console.log(`Database '${databaseName}' is ready.`);
        setupConnection.end();

        db.getConnection((poolErr, connection) => {
          if (poolErr) {
            console.log("DB Pool Error:", poolErr);
            return;
          }

          console.log(`MySQL Connected to '${databaseName}'`);
          connection.release();
        });
      }
    );
  });
};

db.getConnection((err, connection) => {
  if (err) {
    if (err.code === "ER_BAD_DB_ERROR") {
      ensureDatabaseExists();
      return;
    }

    console.log("DB Error:", err);
    return;
  }

  console.log(`MySQL Connected to '${databaseName}'`);
  connection.release();
});

module.exports = db;
