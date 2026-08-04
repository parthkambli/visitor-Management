const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const args = process.argv.slice(2);
const useUserData = args.includes("--production");

let dbPath;
if (useUserData) {
  const appData = process.env.APPDATA || path.join(require("os").homedir(), "AppData", "Roaming");
  dbPath = path.join(appData, "VisitorManagement", "visitor-management.db");
  console.log("Clearing production DB at:", dbPath);
} else {
  dbPath = path.join(__dirname, "..", "visitor-management.db");
  console.log("Clearing dev DB at:", dbPath);
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("DELETE FROM visits");
  db.run("DELETE FROM visitors");
  db.run("DELETE FROM settings");
  db.run("UPDATE pass_sequence SET current_number = 1");
  db.run("DELETE FROM schema_version");
});

db.close(() => {
  console.log("Database cleared successfully.");
});
