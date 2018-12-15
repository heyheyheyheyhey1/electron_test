const router = require("express").Router()
const fs = require("fs")

router.use((req, res) => {
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
module.exports=router