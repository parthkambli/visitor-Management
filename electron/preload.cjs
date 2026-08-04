const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getVisitors: () =>
    ipcRenderer.invoke("visitor:getAll"),

  getVisitorById: (id) =>
    ipcRenderer.invoke("visitor:getById", id),

  searchVisitors: (query) =>
    ipcRenderer.invoke("visitor:search", query),

  createVisitor: (data) =>
    ipcRenderer.invoke("visitor:create", data),

  updateVisitor: (id, data) =>
    ipcRenderer.invoke("visitor:update", id, data),

  deleteVisitor: (id) =>
    ipcRenderer.invoke("visitor:delete", id),

  getVisits: () =>
    ipcRenderer.invoke("visit:getAll"),

  getVisitById: (id) =>
    ipcRenderer.invoke("visit:getById", id),

  getVisitsByVisitor: (visitorId) =>
    ipcRenderer.invoke("visit:getByVisitor", visitorId),

  searchVisits: (query, dateFrom, dateTo) =>
    ipcRenderer.invoke("visit:search", query, { from: dateFrom, to: dateTo }),

  createVisit: (data) =>
    ipcRenderer.invoke("visit:create", data),

  updateVisitStatus: (id, status) =>
    ipcRenderer.invoke("visit:updateStatus", id, status),

  loadAllSettings: () =>
    ipcRenderer.invoke("settings:loadAll"),

  saveAllSettings: (data) =>
    ipcRenderer.invoke("settings:saveAll", data),

  getPassSequence: () =>
    ipcRenderer.invoke("pass:getSequence"),

  checkLicense: () =>
    ipcRenderer.invoke("license:check"),

  activateLicense: (key) =>
    ipcRenderer.invoke("license:activate", key),

  deactivateLicense: () =>
    ipcRenderer.invoke("license:deactivate"),

  getHWID: () =>
    ipcRenderer.invoke("license:hwid"),

  printPass: (id) =>
    ipcRenderer.invoke("print:pass", id),

  printReady: () =>
    ipcRenderer.send("print:ready"),
});
