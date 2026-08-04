const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");

const { initDatabase } = require("./database/db.cjs");

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

const { registerLicenseIpc } =
  require(
    "./ipc/licenseIpc.cjs"
  );

const DEV_URL = "http://localhost:5173";
const DIST_INDEX = path.join(__dirname, "..", "dist", "index.html");

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

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL(DEV_URL);
    win.webContents.on("did-fail-load", (_event, _errorCode, _errorDescription, validatedURL) => {
      console.log("did-fail-load:", validatedURL, _errorDescription);
      if (validatedURL.startsWith(DEV_URL)) {
        console.log("Falling back to dist/index.html");
        win.loadFile(DIST_INDEX);
      }
    });
  } else {
    win.loadFile(DIST_INDEX);
  }
}

app.whenReady().then(() => {

  initDatabase(app.getPath("userData"));

  ipcMain.handle("print:pass", async (event, passId) => {
    const printWin = new BrowserWindow({
      show: false,
      width: 794,
      height: 1123,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.cjs"),
      },
    });

    printWin.webContents.on("console-message", (...args) => {
      const first = args[0];
      const message = args[2] !== undefined ? args[2] : first?.message;
      console.log("[PRINT WINDOW]", message);
    });

    printWin.webContents.on(
      "did-fail-load",
      (_event, errorCode, errorDescription, validatedURL) => {
        console.error(
          "[PRINT LOAD FAILED]",
          errorCode,
          errorDescription,
          validatedURL
        );
      }
    );

    const isDev = !app.isPackaged;

    try {
      // IMPORTANT: listen BEFORE loading the page, so the print:ready
      // emitted by PrintPass can never be missed.
      const readyPromise = waitForPrintReady(printWin);

      if (isDev) {
        try {
          await printWin.loadURL(`${DEV_URL}/#/print/${passId}`);
        } catch (loadErr) {
          console.error("Dev print page failed to load:", loadErr);
          await printWin.loadFile(DIST_INDEX, { hash: `/print/${passId}` });
        }
      } else {
        await printWin.loadFile(DIST_INDEX, { hash: `/print/${passId}` });
      }

      await readyPromise;
      console.log("Print page ready");

      const pdf = await printWin.webContents.printToPDF({
        printBackground: true,
        pageSize: "A4",
        margins: { marginType: "none" },
      });

      const file = path.join(
        app.getPath("temp"),
        `visitor-pass-${passId}-${Date.now()}.pdf`
      );
      fs.writeFileSync(file, pdf);
      console.log("PDF created:", file);

      const openError = await shell.openPath(file);
      if (openError) {
        throw new Error(`Failed to open PDF: ${openError}`);
      }

      return { success: true, file };
    } catch (err) {
      console.error("print:pass failed", err);
      return { success: false, reason: String((err && err.message) || err) };
    } finally {
      if (!printWin.isDestroyed()) printWin.destroy();
    }
  });

  function waitForPrintReady(printWin) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ipcMain.removeListener("print:ready", onReady);
        reject(new Error("timeout waiting for pass content"));
      }, 20000);

      const onReady = (event) => {
        if (event.sender.id !== printWin.webContents.id) return;
        clearTimeout(timeout);
        ipcMain.removeListener("print:ready", onReady);
        resolve();
      };

      ipcMain.on("print:ready", onReady);

      printWin.webContents.once("destroyed", () => {
        clearTimeout(timeout);
        ipcMain.removeListener("print:ready", onReady);
        reject(new Error("print window destroyed before ready"));
      });
    });
  }

  registerSettingsIpc();
  registerVisitorIpc();
  registerVisitIpc();
  registerLicenseIpc();

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
