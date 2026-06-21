// const sqlite3 = require("sqlite3").verbose();
// const path = require("path");

// const dbPath = path.join(
//   __dirname,
//   "../../visitor-management.db"
// );

// const db = new sqlite3.Database(
//   dbPath,
//   (err) => {
//     if (err) {
//       console.error(
//         "Database connection failed:",
//         err.message
//       );
//     } else {
//       console.log(
//         "SQLite connected"
//       );
//     }
//   }
// );

// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS settings (
//       id INTEGER PRIMARY KEY,

//       organization_name TEXT,
//       logo_path TEXT,

//       pass_prefix TEXT,
//       pass_start_number INTEGER,

//       theme TEXT,

//       primary_color TEXT,
//       secondary_color TEXT,

//       backup_enabled INTEGER,
//       backup_frequency TEXT,
//       backup_location TEXT
//     )
//   `);
// });

// module.exports = db;











const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(
  __dirname,
  "../../visitor-management.db"
);

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
});

module.exports = db;