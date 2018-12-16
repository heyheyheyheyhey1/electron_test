const db = require("../db.js")
const router = require("express").Router()
const crypto = require("crypto")
router.use((req, resp) => {
    console.log("activing ", req.email)
    db.searchUser("email", req.query.email)
        .then(handleValue)
        .then(getHex)
        .then((arg) => {
            return new Promise((res, rej) => {
                if (arg == req.query.hex) resp("ok")
                else rej("链接不正确")
            })
        })
        .catch((arg) => {
            resp.send(arg)
        })
})
function handleValue(arg) {
    return new Promise((res, rej) => {
        if (arg.length > 0) {
            res(arg[0].email + ":" + arg[0].passwd)
        } else {
            rej("no such user")
        }
    })
}
function getHex(arg) {
    return new Promise((res, rej) => {
        let hex = crypto.createHash("md5")
        hex.update(arg)
        res(hex.digest(arg))
    })
}
module.exports=router