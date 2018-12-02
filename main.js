const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain
const process = require('child_process')
process.exec('node server.js')
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win_login
let win_chat_list

function createWindowLogin() {
  // 创建浏览器窗口。
  win_login = new BrowserWindow({ width: 1300, height: 860 })
  // 然后加载应用的 index.html。
  win_login.loadFile('login.html')

  // 当 window 被关闭，这个事件会被触发。
  win_login.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win_login = null
  })
}


//创建隐藏的chat_list窗口
// function createWindowChatList(){
//   win_chat_list=new BrowserWindow({width:1200,height:860,show:false})
//   win_chat_list.loadFile('chat_list.html')

// }



// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindowLogin)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win_login === null) {
    createWindowLogin()
  }
})

ipc.on('show_chat_list', () => {
  // createWindowChatList()
  // win_chat_list.show()
  win_login.loadFile('chat_list.html')
  win_login.webContents.openDevTools()
})


// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。




