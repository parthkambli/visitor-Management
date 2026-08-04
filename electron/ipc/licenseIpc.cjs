const { ipcMain } = require("electron");
const { verifyLicenseKey } = require("../license/crypto.cjs");
const { saveActivation, loadActivation, isActivated, deactivate } = require("../license/activator.cjs");
const { generateHWID } = require("../license/hwid.cjs");

function registerLicenseIpc() {
  ipcMain.handle("license:check", async () => {
    const activation = loadActivation();
    if (!activation) {
      return { activated: false, activation: null };
    }

    const hwid = await generateHWID();
    const activated = activation.hwid === hwid.hash;

    return { activated, activation };
  });

  ipcMain.handle("license:activate", async (_event, key) => {
    const result = await verifyLicenseKey(key);

    if (!result.valid) {
      return { success: false, error: result.error };
    }

    saveActivation(key, result.hwid);

    return {
      success: true,
      activation: loadActivation(),
    };
  });

  ipcMain.handle("license:deactivate", () => {
    deactivate();
    return { success: true };
  });

  ipcMain.handle("license:hwid", async () => {
    const hwid = await generateHWID();
    return hwid.short;
  });
}

module.exports = { registerLicenseIpc };
