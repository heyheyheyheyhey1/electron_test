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

//express部分
app.use(express.static("./"))
app.use(muilter.any())
app.use("/", (req, res, next) => {
    console.log("incomming request")
    next()
})


app.post("/uploadFiles", (req, res) => {
    let file = req.files[0]
    console.log(file)
    let name = file.filename
    let originalname = file.originalname
    let fileDest=`FileRecv/${name}`
    if (originalname.split(".").length > 1) {
        fileDest=`FileRecv/${name}.${originalname.split(".")[originalname.split(".").length - 1]}`
        fs.rename(`FileRecv/${name}`, fileDest,(err)=>{if(err)console.log(err)})
    }
    res.send({
        status: "ok",
        fileDest,
        originalname
    })

})





//ws 部分
wsSever.on("connection", (connection) => {
    console.log('new connection')
    connection.on('message', (msg) => {
        console.log(msg)
        wsSever.clients.forEach((el) => {
            el.send(msg)
        })
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