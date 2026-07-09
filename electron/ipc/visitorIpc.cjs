const { ipcMain } = require("electron");
const visitorService = require("../database/visitorService.cjs");

function registerVisitorIpc() {
  ipcMain.handle("visitor:getAll", async () => {
    return visitorService.getAll();
  });

  ipcMain.handle("visitor:getById", async (_, id) => {
    return visitorService.getById(id);
  });

  ipcMain.handle("visitor:search", async (_, query) => {
    return visitorService.search(query);
  });

  ipcMain.handle("visitor:create", async (_, data) => {
    return visitorService.create(data);
  });

  ipcMain.handle("visitor:update", async (_, id, data) => {
    return visitorService.update(id, data);
  });

  ipcMain.handle("visitor:delete", async (_, id) => {
    return visitorService.delete(id);
  });
}

module.exports = registerVisitorIpc;
