const db = require("../db.js")
const router = require("express").Router()
router.use((req, resp) => {
    db.searchUser("email", req.query.filter)
        .then((arg) => {
            return new Promise((res, rej) => {

                if (arg.length > 0) {
                    resp.send(arg[0])
                }
                else {
                    res(req.query.filter)
                }
            })
        })
        .then(db.searchRoom)
        .then((arg) => {
            return new Promise((res, rej) => {
                console.log(arg)
                if (arg.length == 0) {
                    rej("没这个信息")
                }
                else {
                    console.log(arg)
                    arg[0].type = "room"
                    resp.send(arg[0])
                }
            })
        })
        .catch((arg) => {
            console.log(arg)
            resp.send({
                status: "failed",
                info: arg
            })
        })
})
module.exports = router