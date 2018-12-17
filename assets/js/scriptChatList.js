//初始变量声明
let myid = -1
let targetid = -1
let targetSum = 0
let targets = []
let myInfo = null

//获取id
if (isInBrowser) {
    let url = document.location.href
    myid = url.split("id=")[1]
    console.log("get id ", myid)
    if (myid == undefined) {
        window.close()
    }
} else {
    const ipcRender = nodeRequire('electron').ipcRenderer
    myid = ipcRender.sendSync("getid")
}

//获取和设置用户信息
(function () {
    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("GET", `http://108.61.182.64:66/getinfo?id=${myid}`, true)
    xmlRequest.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            console.log("get info success ", xmlRequest.responseText)
            myInfo = JSON.parse(xmlRequest.responseText)
            $("#username")[0].innerHTML = myInfo.username
        }
    }
    xmlRequest.send(null)
})()


/*ui处理部分*/

//发送按钮事件
document.getElementById('btnSendMessage').onclick = function () {
    if (targetid == -1) {
        return
    }
    let msg_text = document.getElementById('writtingArea')

    console.log("sending ", msg_text)
    let msgSend = {
        data: msg_text.value.replace(/\[:emoji_(\d+)]/g, `<img src="assets/emoji/$1.gif">`),
        senderid: myid,
        targetid,
        msgType: "normal"
    }
    ws.send(JSON.stringify(msgSend))
    writtingArea.value = ""

}

//表情按钮事件
document.getElementById("btnSelectEmoji").onclick = function (e) {
    let emojiArea = document.getElementById("emojiArea")
    emojiArea.style.display = emojiArea.style.display == "flex" ? "none" : "flex"

}

//文件按钮事件
document.getElementById("btnSelectFile").onclick = function (e) {
    $("#fileSelector").click()
    console.log("ready")
}


//上传文件事件
function uploadFile(el) {
    let file = el.files[0]
    console.log(file)
    let formData = new FormData(file)
    formData.append("senderid", myid)
    formData.append("file", file)
    console.log("get file form", formData)

    //构建xmlHttpRequest
    let xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.open("POST", "http://108.61.182.64:66/uploadFiles", true)
    xmlHttpRequest.onreadystatechange = function () {
        //判断返回值
        if (this.readyState == 4 && this.status == 200) {
            let msgRecv = JSON.parse(xmlHttpRequest.responseText)
            switch (msgRecv.status) {
                case "ok": {
                    console.log(msgRecv)
                    ws.send(JSON.stringify({ senderid: myid, msgType: "file", fileDest: msgRecv.fileDest, data: "", originalname: msgRecv.originalname, targetid }))
                }
                default: {
                    console.log("sending file failed")
                }
            }
        }
    }
    xmlHttpRequest.send(formData)
}




//点击表情按钮
for (let i = 0; i < 50; i++) {
    let emoji_el = document.createElement("img")
    emoji_el.src = `assets/emoji/${i}.gif`
    $("#emojiArea").append(emoji_el)
    emoji_el.onclick = function (el) {
        $("#emojiArea").css("display", "none")
        $("#writtingArea").val($("#writtingArea").val() + `[:emoji_${i}]`)
    }
}

//搜索联系人
$("#btnAddTarget").click(function () {
    let xmlRequest = new XMLHttpRequest()
    let currentTarget = $("#currentTargetInput").val()
    xmlRequest.open("GET", `http://108.61.182.64:66/searchUser?filter=${currentTarget}`, true)
    xmlRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            addToChatList(xmlRequest.responseText)
        }
    }
    xmlRequest.send(null)
})

//通过id获取用户信息,阻塞方法
function getUserInfoById(arg) {
    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("GET", `http://108.61.182.64:66/getinfo?id=${arg}`, false)
    xmlRequest.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            console.log("get info success ", xmlRequest.responseText)
            // return new Promise((res,rej)=>{
            //     res(JSON.parse(xmlRequest.responseText))
            // })
        }
    }
    xmlRequest.send(null)
    return xmlRequest.responseText
}

//添加至聊天列表
function addToChatList(arg) {
    console.log("adding: ", arg)
    $("#currentTargetInput").val("")
    arg = JSON.parse(arg)

    if (targets[arg.id] != undefined || arg.id == myid || arg.status == "failed") return
    if (arg.type == "room") {
        
        ws.send(JSON.stringify({
            senderid: myid,
            msgType: "joinroom",
            data: "",
            targetid:arg.id
        }))
    }

    let chatList = document.getElementById("chatList")
    //创建a标签
    el_a = document.createElement("a")
    el_a.href = "#"
    el_a.classList.add("list-group-item")
    el_a.onclick = function () {
        if (targetid == arg.id) return
        targetid = arg.id
        document.getElementById("chattingName").innerHTML = `${arg.username}`
        refreshMsgList(arg)
    }
    //创建span标签    
    el_span = document.createElement("span")
    el_span.classList.style = "margin-left: 10px;"
    el_span.innerHTML = arg.username
    //span套入a
    el_a.append(el_span)
    //a套入chatlist
    chatList.append(el_a)
    targets[arg.id] = {
        msgs: []
    }
    console.log(targets[arg.id])
}

//刷新MsgList
function refreshMsgList(arg) {

    console.log("target change to ", targetid, arg.username)
    console.log()
    $("#msgList")[0].innerHTML = ""
    targets[arg.id].msgs.forEach(el => {
        parseMsgToItem(el)
    })
}



//处理msg
function parseMsgToItem(msg) {
    console.log("parsing ", msg)
    let msgRecv = JSON.parse(msg)

    el_li = document.createElement('li')
    el_p = document.createElement('p')

    el_p.classList.add("msgcard")


    //判断左边还是右边
    if (msgRecv.senderid != myid) {
        el_li.classList.add("msgleft")
    } else {
        el_li.classList.add("msgright")
    }

    //判断msg类型
    if (msgRecv.msgType == "normal") {
        el_p.innerHTML = msgRecv.data
    } else {
        console.log(msgRecv.originalname.split(".")[1])
        if (["jpg", "jpeg", "png", "gif", "JPG", "JPEG", "PNG", "GIF"].indexOf(msgRecv.originalname.split(".")[1]) != -1) {
            console.log("recv img")
            let el_img = document.createElement("img")
            el_img.style = "height:90px;width:60px"
            el_img.src = msgRecv.fileDest
            el_p.appendChild(el_img)
        } else {
            console.log("recv file")
            let el_a = document.createElement("a")
            el_a.href = msgRecv.fileDest
            el_a.download = msgRecv.originalname
            //文件判断左右
            if (msgRecv.senderid == myid) {
                el_a.innerHTML = `成功发送文件 ${msgRecv.originalname} ，点击此处可下载`
            } else {
                el_a.innerHTML = `收到文件 ${msgRecv.originalname} ，点击此处可下载`
            }
            el_p.appendChild(el_a)
        }
    }

    //el加入新元素
    el_li.appendChild(el_p)

    //添加el
    //当发送者为我或者发送者为当前对象才添加
    if (msgRecv.senderid == myid || msgRecv.senderid == targetid) document.getElementById("msgList").appendChild(el_li)


    //scroll移动到最下面
    document.getElementById("rightCenter").scrollTop = document.getElementById("rightCenter").scrollHeight;
}

//添加倒聊天列表





//websocket处理部分
let ws = new WebSocket("ws://108.61.182.64:66", [myid])

ws.onmessage = function (msg) {
    console.log("receive", msg.data)
    //发送者是我则向当前对象消息列表推入
    if (JSON.parse(msg.data).senderid == myid) {
        targets[targetid].msgs.push(msg.data)
    } else {
        //发送者不是我，判断发送者存储数组是不是undifined,如果是证明是对方发起的新会话
        if (targets[JSON.parse(msg.data).senderid] == undefined) {
            let info = getUserInfoById(JSON.parse(msg.data).senderid)
            addToChatList(info)
        }
        //发送者的消息列表插一条
        targets[JSON.parse(msg.data).senderid].msgs.push(msg.data)
    }

    parseMsgToItem(msg.data)
}

ws.onopen = function (server) {
    console.log("connected ws server ")
}

ws.onclose = function (server) {
    console.log("disconnected ", server)
}

ws.onerror = function (err) {
    console.log(err)
}

