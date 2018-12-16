const mysql = require('mysql')
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "101800",
    database: "simplechatroom",
    port: 3306
})

function searchUser(filter, arg) {
    return new Promise((res, rej) => {
        db.query(`select * from users where ${filter}  = '${arg}'`, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

function insertMsg(msg) {
    return new Promise((res, rej) => {
        db.query(`insert into msg (senderid,targetid,content) values ("${msg.senderid}","${msg.targetid}","${msg.data}")`, (err, data) => {
            if (err) rej(err)
            else res("ok")
        })
    })
}

function getMsgView(userid) {
    return new Promise((res, rej) => {
        db.query(`select msgView${userid}`, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

function createMsgView(user) {
    return new Promise((res, rej) => {
        db.query(`create view as select * from msg where id = "${user.id}"`, (err, data) => {
            if (err) rej(err)
            else res("ok")
        })
    })
}

function createUser(user) {
    return new Promise((res, rej) => {
        db.query(`insert into users (username,email,isactive,passwd) values("${user.username}","${user.email}","${0}","${user.passwd}")`, (err, data) => {
            if (err) rej("已经被注册")
            else res("ok")
        })
    })
}

function updateUser(filter, filterArg, targetFilter, targetFilterArg) {
    return new Promise((res, rej) => {
        db.query(`update users set ${targetFilter} = ${targetFilterArg} where ${filter} = ${filterArg}`, (err, data) => {
            if (err) {
                rej(err)
            }
            else res(data)
        })
    })
}

exports.createMsgView = createMsgView
exports.getMsgView = getMsgView
exports.insertMsg = insertMsg
exports.searchUser = searchUser
exports.createUser = createUser