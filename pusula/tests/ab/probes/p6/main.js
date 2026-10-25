const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const fs = require("fs");
const path = require("path");

const notesFile = () => path.join(app.getPath("userData"), "notes.txt");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true },
  });
  win.loadFile("index.html");
}

ipcMain.handle("notes:read", async () => (fs.existsSync(notesFile()) ? fs.readFileSync(notesFile(), "utf8") : ""));
ipcMain.handle("notes:save", async (_event, text) => fs.writeFileSync(notesFile(), text, "utf8"));
ipcMain.handle("file:pick", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openFile"], filters: [{ name: "Text", extensions: ["txt", "md"] }] });
  return result.canceled ? null : fs.readFileSync(result.filePaths[0], "utf8");
});

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
