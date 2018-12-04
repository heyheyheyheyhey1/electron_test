const express = require('express')
const app = express()
const ws = require('ws')
const http = require('http')
const httpServer = http.createServer(app)
const wsSever=new ws.Server({server:httpServer})


wsSever.on("connection",(connection)=>{
    console.log('new connection')
    connection.on('message',(msg)=>{
        console.log(msg)
        wsSever.clients.forEach((el)=>{
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

wsSever.on("error",(err)=>{
    console.log(err)
})


httpServer.listen(66)