const mysql = require('mysql');
const db = mysql.createConnection({
    host : "127.0.0.1",
    user : "root",
    port : "3306",
    password : "webkh141303!",
    database : "ConnectHighShcem"
})
db.connect( err=>
    { if (err) console.log("MySQL 연결 실패 : ", err);
console.log("MySQL Connected!!!");});
module.exports = db;