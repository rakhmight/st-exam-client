'use strict'
import { app, protocol, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater } from "electron-updater"
const isDevelopment = process.env.NODE_ENV !== 'production'
const exampleMenuTemplate = [
  {
    label: "Window",
    submenu: [
      {
        label: "Zoom In",
        role: "zoomIn"
      },
      {
        label: "Zoom Out",
        role: "zoomOut"
      },
      {
        label: "Actual size",
        role: "resetZoom"
      },
      { type: "separator" },
      {
        label: "Close app",
        click: () => app.quit()
      }
    ]
  },
  {
    label: "&View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      isDevelopment ? { type: "separator" } : {},
      isDevelopment ? { role: "toggleDevTools" } : {}
    ],
  }
];

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    resizable: false,
    frame: !app.isPackaged ? true : false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: !app.isPackaged,
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
    
    const menu = Menu.buildFromTemplate(exampleMenuTemplate)
    Menu.setApplicationMenu(menu)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    win.setMenu(null)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath("exe")
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});