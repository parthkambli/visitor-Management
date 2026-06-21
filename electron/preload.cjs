const {
  contextBridge,
  ipcRenderer,
} = require("electron");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    saveOrganizationName: (
      name
    ) =>
      ipcRenderer.invoke(
        "settings:saveOrganizationName",
        name
      ),

    getOrganizationName: () =>
      ipcRenderer.invoke(
        "settings:getOrganizationName"
      ),
  }
);