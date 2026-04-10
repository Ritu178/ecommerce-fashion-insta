const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const candidatePaths = [
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
];

let loadedEnvPath = null;

for (const envPath of candidatePaths) {
  if (!fs.existsSync(envPath)) {
    continue;
  }

  dotenv.config({ path: envPath });
  loadedEnvPath = envPath;
  break;
}

const requiredDatabaseEnv = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingDatabaseEnv = requiredDatabaseEnv.filter(
  (name) => !process.env[name] || !process.env[name].trim()
);

function assertDatabaseEnv() {
  if (missingDatabaseEnv.length === 0) {
    return;
  }

  const searchedPaths = candidatePaths.map((envPath) => `- ${envPath}`).join("\n");
  const sourceMessage = loadedEnvPath
    ? `Loaded env file: ${loadedEnvPath}`
    : "No env file was found.";

  throw new Error(
    [
      "Database configuration is incomplete.",
      sourceMessage,
      `Missing variables: ${missingDatabaseEnv.join(", ")}`,
      "Create one of these files and define the required variables:",
      searchedPaths,
    ].join("\n")
  );
}

module.exports = {
  assertDatabaseEnv,
  loadedEnvPath,
};
