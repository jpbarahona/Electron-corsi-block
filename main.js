const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app

const path = require('path')
const url = require('url')
const menuBar = require('./src/app/menu')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1080, height: 820})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/template/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

if (process.platform === 'darwin') {
  const name = electron.app.getName()
  menuBar.template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
  })

  // Window menu.
  menuBar.template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })

  menuBar.addUpdateMenuItems(menuBar.template[0].submenu, 1)
}

if (process.platform === 'win32') {
  const helpMenu = menu.template[menu.template.length - 1].submenu
  menuBar.addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', function () {
  const menu = Menu.buildFromTemplate(menuBar.template)
  Menu.setApplicationMenu(menu)
  createWindow()
})

app.on('browser-window-created', function () {
  let reopenMenuItem = menuBar.findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
  let reopenMenuItem = menuBar.findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = true
})
