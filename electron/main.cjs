const { app, BrowserWindow } = require("electron");

const path = require("path");

require("./database/db.cjs");

const registerSettingsIpc =
  require(
    "./ipc/settingsIpc.cjs"
  );

const registerVisitorIpc =
  require(
    "./ipc/visitorIpc.cjs"
  );

const registerVisitIpc =
  require(
    "./ipc/visitIpc.cjs"
  );

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(
        __dirname,
        "preload.cjs"
      ),
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {

  registerSettingsIpc();
  registerVisitorIpc();
  registerVisitIpc();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});