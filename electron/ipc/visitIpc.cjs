const { ipcMain } = require("electron");
const visitService = require("../database/visitService.cjs");

function registerVisitIpc() {
  ipcMain.handle("visit:getAll", async () => {
    return visitService.getAll();
  });

  ipcMain.handle("visit:getById", async (_, id) => {
    return visitService.getById(id);
  });

  ipcMain.handle("visit:getByVisitor", async (_, visitorId) => {
    return visitService.getByVisitorId(visitorId);
  });

  ipcMain.handle("visit:search", async (_, query, dateRange) => {
    return visitService.search(query, dateRange);
  });

  ipcMain.handle("visit:create", async (_, data) => {
    const passId = await visitService.generatePassId();
    return visitService.create({ ...data, pass_id: passId });
  });

  ipcMain.handle("visit:updateStatus", async (_, id, status) => {
    return visitService.updateStatus(id, status);
  });
}

module.exports = registerVisitIpc;
