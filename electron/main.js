const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'default',
    title: 'AI Writing Assistant',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// File system handlers
ipcMain.handle('save-file', async (_, { content, defaultName }) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'html'] }],
  })
  if (filePath) {
    fs.writeFileSync(filePath, content, 'utf-8')
    return filePath
  }
  return null
})

ipcMain.handle('open-file', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Documents', extensions: ['txt', 'md', 'html'] }],
    properties: ['openFile'],
  })
  if (filePaths[0]) {
    return { path: filePaths[0], content: fs.readFileSync(filePaths[0], 'utf-8') }
  }
  return null
})
