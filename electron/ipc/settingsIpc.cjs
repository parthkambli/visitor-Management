const { ipcMain } = require("electron");
const { getDb } = require("../database/db.cjs");

function runQuery(sql, params = []) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function registerSettingsIpc() {
  ipcMain.handle("settings:saveAll", async (_, data) => {
    const db = getDb();
    console.log("[Settings] Saving:", JSON.stringify(data, null, 2));

    await runQuery(
      `INSERT OR REPLACE INTO settings (id, organization_name, logo_path, pass_prefix, pass_start_number, theme, primary_color, secondary_color, backup_enabled, backup_frequency, backup_location)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.organization_name || null,
        data.logo_path || null,
        data.pass_prefix || null,
        data.pass_start_number != null ? data.pass_start_number : null,
        data.theme || null,
        data.primary_color || null,
        data.secondary_color || null,
        data.backup_enabled ? 1 : 0,
        data.backup_frequency || null,
        data.backup_location || null,
      ]
    );

    await runQuery(
      "UPDATE pass_sequence SET prefix = ?, current_number = ? WHERE id = 1",
      [data.pass_prefix || "VIS", data.pass_start_number != null ? data.pass_start_number : 1]
    );

    const verify = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM pass_sequence WHERE id = 1", [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    console.log("[Settings] pass_sequence after save:", JSON.stringify(verify));

    const verifySettings = await new Promise((resolve, reject) => {
      db.get("SELECT pass_prefix, pass_start_number FROM settings WHERE id = 1", [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    console.log("[Settings] settings after save:", JSON.stringify(verifySettings));

    return true;
  });

  ipcMain.handle("settings:loadAll", async () => {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM settings WHERE id = 1", [], (err, row) => {
        if (err) reject(err);
        else
          resolve(
            row || {
              organization_name: "",
              logo_path: "",
              pass_prefix: "VIS",
              pass_start_number: 1,
              theme: "light",
              primary_color: "#2563eb",
              secondary_color: "#6b7280",
              backup_enabled: false,
              backup_frequency: "daily",
              backup_location: "",
            }
          );
      });
    });
  });

  ipcMain.handle("pass:getSequence", async () => {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT s.pass_prefix, s.pass_start_number, p.current_number FROM settings s, pass_sequence p WHERE s.id = 1 AND p.id = 1",
        [],
        (err, row) => {
          if (err) reject(err);
          else {
            console.log("[PassSequence] getSequence result:", JSON.stringify(row));
            resolve(row || { pass_prefix: "VIS", pass_start_number: 1, current_number: 1 });
          }
        }
      );
    });
  });
}

module.exports = registerSettingsIpc;
