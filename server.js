const express = require('express')
const app = express()
const fs = require('fs')
const muilter = require('multer')({
    dest: "FileRecv/"
})
const ws = require('ws')
const http = require('http')
const httpServer = http.createServer(app)
const wsSever = new ws.Server({ server: httpServer })
var sockets=[]
//express部分
app.use(express.static("./"))
app.use(muilter.any())
app.use("/", (req, res, next) => {
    console.log(req.url)
    next()
})
app.use("/uploadFiles", require("./routers/uploadFiles.js"))
app.use("/login",require("./routers/login.js"))
app.use("/getinfo",require("./routers/getinfo.js"))
app.use("/searchUser",require("./routers/searchUser.js"))
app.use("/rejiste"),require("./routers/rejiste.js")
app.use("/active",require("./routers/active.js"))


//ws 部分
wsSever.on("connection", (connection) => {
    console.log('new connection with protocol : ',connection.protocol)
    sockets[connection.protocol]=connection
    connection.on('message', (msg) => {
        console.log(msg)
        let targetid=JSON.parse(msg).targetid
        connection.send(msg)
        if(sockets[targetid]!=undefined) sockets[targetid].send(msg)

    })
    connection.on("close",(arg)=>{
        sockets[connection.protocol]=undefined
    })
    //可以获取msg的具体信息
    // connection.onmessage=(msg)=>{
    //     console.log(msg.data)
    //     wsSever.clients.forEach((el)=>{
    //         el.send(msg.data)
    //     })
    // }
})

wsSever.on("error", (err) => {
    console.log(err)
})


httpServer.listen(66)