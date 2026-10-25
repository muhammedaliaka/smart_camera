const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  readNotes: () => ipcRenderer.invoke("notes:read"),
  saveNotes: (text) => ipcRenderer.invoke("notes:save", text),
  pickFile: () => ipcRenderer.invoke("file:pick"),
});
