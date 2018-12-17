const db=require("../db.js")
const router=require("express").Router()
router.use((req,res)=>{
    console.log(req.query)
    if (req.query!=undefined||req.query!=""){
        db.searchUser("email",req.query.email)
        .then((arg)=>{
            if(arg.length>0&&req.query.passwd==arg[0].passwd){
                res.send({
                    status:"ok",
                    id:arg[0].id,
                    username:arg[0].username
                })
            }else{
                res.send({
                    status:"false",
                    id:-1,
                    username:""
                })
            }
        })
        .catch(console.log)
    }
})

module.exports=router