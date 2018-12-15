const db = require("../db.js")
const router = require("express").Router()
router.use((req,res)=>{
    db.searchUser("email",req.query.email)
    .then((arg)=>{
        res.send(arg[0])
    })
    .catch(console.log)
})
module.exports=router