const db = require("../db.js")
const router = require("express").Router()
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const transport = nodemailer.createTransport({

    service: 'qq',
    port: 587,
    secure: true,
    auth: {
        user: '912126472@qq.com',
        pass: 'nxcxdzfatylcbchi'
    }
})


router.use((req, resp) => {

    db.searchUser("email", req.body.email)
        .then((arg) => { //检查是否存在
            return new Promise((res, rej) => {
                if (arg.length != 0) rej("存在该用户")
                else res(req.body)
            })
        })
        .then(db.createInactiveUser)
        .then(() => {
            return new Promise((res, rej) => {
                let hexString = crypto.createHash("md5")
                hexString.update(req.body.email + ":" + req.body.passwd)
                let s = `<a href=\"http://127.0.0.1:66/active?email=${req.body.email}&hex=${hexString.digest('hex')}">点击此处激活</a>`
                console.log("Create hash OK")
                res({
                    target: req.body.email,
                    html: s
                })
            })
        })
        .then(sendActiveMail)
        .then((arg) => {
            resp.send({
                status: "ok",
                info: arg
            })
        })
        .catch((err) => {
            resp.send({
                status: "failed",
                info: err
            })
        })

})



function sendActiveMail(arg) {
    return new Promise((res, rej) => {

        transport.sendMail({ from: "912126472@qq.com", to: arg.target, subject: "验证您的邮箱", html: arg.html }, (err, info) => {
            if (err) {
                console.log(err)
                rej("email service error")
            } else {
                res("email send ok")
            }
        })
    })
}

module.exports = router