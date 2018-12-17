const db = require("../db.js")
const router = require("express").Router()
const crypto = require("crypto")
router.use((req, resp) => {
    console.log("activing ", req.query.email)
    db.serachInactiveUser("email", req.query.email)
        .then(handleUserInfo)
        .then((arg) => { //判断hex值
            return new Promise((res, rej) => {
                console.log("true value ", arg)
                let hexString = crypto.createHash("md5")
                console.log("1")
                hexString.update(arg.email + ":" + arg.passwd)
                console.log("2")
                let hex = hexString.digest('hex')
                console.log("3")
                if (hex == req.query.hex) {
                    res(arg)
                }

                else {
                    console.log("hex wrong")
                    rej("链接不正确")
                }
            })
        })
        .then(db.deleteActived) //删除待激活的
        .then(db.createUser)//创造新用户
        .then(() => {
            resp.send("成功激活")
        })
        .catch((arg) => {
            resp.send(arg)
        })
})

function handleUserInfo(arg) {
    return new Promise((res, rej) => {
        if (arg.length > 0) {
            res(arg[0])
        } else {
            rej("链接失效")
        }
    })
}



module.exports = router