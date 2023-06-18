import { app, BrowserWindow, screen, ipcMain } from "electron";
import os from 'os';
import fs from 'fs';
import * as path from "path";
import * as url from "url";

let mainWindow: Electron.BrowserWindow | null;

function browserWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width / 2,
    height: height / 1.5,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: process.env.NODE_ENV !== "production",
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:4000");
  } else {
    const indexPath = path.join(__dirname, 'index.html');
    const fileUrl = new URL(`file://${indexPath}`).href;
    mainWindow.loadURL(fileUrl);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.on("html", (event, _) => {
    fs.writeFileSync(`Создано при помощи Electron.txt`, `${os.platform()}(${os.arch()}) - ${os.release()}`, 'utf-8');
    event.reply("reply", "Файл успешно создан!");
  })

  mainWindow.maximize();
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    browserWindow();
  }
});


app.whenReady().then(browserWindow);