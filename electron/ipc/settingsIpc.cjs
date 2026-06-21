const {
  ipcMain,
} = require("electron");

const db = require(
  "../database/db.cjs"
);

function registerSettingsIpc() {
  ipcMain.handle(
    "settings:saveOrganizationName",
    async (_, name) => {
      return new Promise(
        (resolve, reject) => {
          db.run(
            `
            INSERT OR REPLACE INTO settings
            (
              id,
              organization_name
            )
            VALUES
            (
              1,
              ?
            )
          `,
            [name],
            (err) => {
              if (err)
                reject(err);
              else
                resolve(true);
            }
          );
        }
      );
    }
  );

  ipcMain.handle(
    "settings:getOrganizationName",
    async () => {
      return new Promise(
        (resolve, reject) => {
          db.get(
            `
            SELECT organization_name
            FROM settings
            WHERE id = 1
          `,
            [],
            (err, row) => {
              if (err)
                reject(err);
              else
                resolve(
                  row
                    ?.organization_name ||
                    ""
                );
            }
          );
        }
      );
    }
  );
}

module.exports =
  registerSettingsIpc;