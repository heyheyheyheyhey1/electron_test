
// const ipc = require('electron').ipcRendserer
let email = document.getElementById("email")
let passwd = document.getElementById("passwd")
let submit = document.getElementById("btnLogin")

// ipc.send('show_chat_list'); 发送事件


submit.onclick = function () {
    let xmlRequest = new XMLHttpRequest()
    console.log("email: ", email.value, "passwd: ", passwd.value)
    xmlRequest.open("GET", `http://127.0.0.1:66/login?email=${email.value}&passwd=${passwd.value}`, true)
    xmlRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let info = JSON.parse(xmlRequest.responseText)
            console.log(info)
            if (info.status == "ok") {
                if (!isInBrowser) {
                    let ipcRenderer = nodeRequire("electron").ipcRenderer

                    ipcRenderer.send("setid", info.id)

                    ipcRenderer.send("showChatList")
                    console.log("ggggg")
                } else {
                    window.open(`http://127.0.0.1:66/chatList.html?id=${info.id}`, "_self", null, true)

                }
            }
        }
    }
    xmlRequest.send(null)
}
