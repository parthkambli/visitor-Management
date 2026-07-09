const { ipcMain } = require("electron");
const db = require("../database/db.cjs");

function registerSettingsIpc() {
  ipcMain.handle("settings:saveAll", async (_, data) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO settings (id, organization_name, logo_path, pass_prefix, pass_start_number, theme, primary_color, secondary_color, backup_enabled, backup_frequency, backup_location)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.organization_name || null,
          data.logo_path || null,
          data.pass_prefix || null,
          data.pass_start_number || null,
          data.theme || null,
          data.primary_color || null,
          data.secondary_color || null,
          data.backup_enabled ? 1 : 0,
          data.backup_frequency || null,
          data.backup_location || null,
        ],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  });

  ipcMain.handle("settings:loadAll", async () => {
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
              primary_color: "#1976d2",
              secondary_color: "#dc004e",
              backup_enabled: false,
              backup_frequency: "daily",
              backup_location: "",
            }
          );
      });
    });
  });
}

module.exports = registerSettingsIpc;
