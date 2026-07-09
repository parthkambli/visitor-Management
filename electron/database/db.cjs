const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(
  __dirname,
  "../../visitor-management.db"
);

const SCHEMA_VERSION = 1;

const migrations = {};

const db = new sqlite3.Database(
  dbPath,
  (err) => {
    if (err) {
      console.error(
        "Database connection failed:",
        err.message
      );
    } else {
      console.log(
        "SQLite connected"
      );
    }
  }
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,

      organization_name TEXT,
      logo_path TEXT,

      pass_prefix TEXT,
      pass_start_number INTEGER,

      theme TEXT,

      primary_color TEXT,
      secondary_color TEXT,

      backup_enabled INTEGER,
      backup_frequency TEXT,
      backup_location TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      photo TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pass_id TEXT NOT NULL UNIQUE,
      visitor_id INTEGER NOT NULL,
      employee_to_meet TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      visit_time TEXT NOT NULL,
      purpose TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pass_sequence (
      id INTEGER PRIMARY KEY,
      prefix TEXT DEFAULT 'VIS',
      current_number INTEGER DEFAULT 1,
      auto_increment INTEGER DEFAULT 1
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO pass_sequence (id, prefix, current_number, auto_increment)
    VALUES (1, 'VIS', 1, 1)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS schema_version (
      id INTEGER PRIMARY KEY,
      version INTEGER NOT NULL,
      applied_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  db.get(
    "SELECT COALESCE(MAX(version), 0) as current_version FROM schema_version",
    (err, row) => {
      if (err) {
        console.error("Failed to read schema version:", err.message);
        return;
      }

      let currentVersion = row.current_version;

      function applyNext(version) {
        if (version > SCHEMA_VERSION) return;

        if (migrations[version]) {
          migrations[version](db);
        }

        db.run(
          "INSERT INTO schema_version (id, version) VALUES (?, ?)",
          [version, version],
          () => applyNext(version + 1)
        );
      }

      if (currentVersion < SCHEMA_VERSION) {
        applyNext(currentVersion + 1);
      }
    }
  );
});

module.exports = db;