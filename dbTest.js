const db = require("./db.js")
db.createUser({
    username:"aaa",
    email:"9121726472@qq.com",
    passwd:"123"
}).then(console.log).catch(console.log)