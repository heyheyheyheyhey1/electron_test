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
            if (err) rej("")
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
    console.log("creating ", user)
    return new Promise((res, rej) => {
        db.query(`insert into users (username,email,passwd) values("${user.username}","${user.email}","${user.passwd}")`, (err, data) => {
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



function serachInactiveUser(filter, arg) {
    return new Promise((res, rej) => {
        db.query(`select * from inactive where ${filter}  = '${arg}'`, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

function deleteActived(arg) {
    return new Promise((res, rej) => {
        db.query(`delete from inactive where email = "${arg.email}"`, (err, data) => {
            if (err) rej(err)
            else res(arg)
        })
    })
}

function createInactiveUser(arg) {
    return new Promise((res, rej) => {
        console.log("createInactiveUser", arg)
        db.query(`insert into inactive (username,email,passwd) values("${arg.username}","${arg.email}","${arg.passwd}")`, (err, data) => {

            if (err) {
                console.log(err)
                rej("已经被注册")
            }
            else res("ok")
        })
    })
}


function searchRoom(arg){
    return new Promise((res,rej)=>{
        db.query(`select * from rooms where id = '${arg}'`,(err,data)=>{
            if (err ){
                rej("不存在")
            }
            else {
                res(data)
            }
        })
    })
}
// exports.createMsgView = createMsgView
// exports.getMsgView = getMsgView
// exports.insertMsg = insertMsg
exports.searchUser = searchUser
exports.serachInactiveUser = serachInactiveUser
exports.createUser = createUser
exports.createInactiveUser = createInactiveUser
exports.updateUser = updateUser
exports.deleteActived = deleteActived
exports.searchRoom=searchRoom