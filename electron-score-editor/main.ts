// / <reference path="node_modules/@types/node/index.d.ts" />

/*interface NodeRequire { (mod: string): any };
declare var require: NodeRequire;
declare var __dirname: string;
//interface Process { platform: string };
declare var process: Process;*/

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const glob = require('glob')
const path = require('path')
const url = require('url')
//const autoUpdater = require('./auto-updater')


//let $_ = require('../jApps/Scripts/jquery-3.1.1');


//require('./noteEditor.js');


//loadDemos();

// Require each JS file in the main-process dir
/*function loadDemos () {
  var files = glob.sync(path.join(__dirname, 'main-process/** /*.js'))
  files.forEach(function (file: string) {
    require(file)
  })
  //autoUpdater.updateMenu()
}*/


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1300, height: 900})

  mainWindow.toggleDevTools();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
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
    mainWindow = <any>null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (<any>mainWindow === <any>null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
