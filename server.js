 /*
    GET
    POST
    PUT
    DELETE
 */
 

 const express = require('express');
 const bodyParser = require('body-parser'); 
 const server = express();
 const mysql = require('mysql');
 const path = require('path');

 server.use(bodyParser.json());
 server.use(bodyParser.urlencoded({extended: true}));
 server.use(express.json())


var con = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    port : '3306',
    password : 'webkh141303!',
    database : 'ConnectHighShcem'
})

con.connect( err=>
    { if (err) console.log("MySQL 연결 실패 : ", err);
console.log("MySQL Connected!!!");});

server.listen(3000, () => {
    console.log("!!server is running!!");
}) 




const users = [
    {
        id : '1234',
        name : 'keoni',
        email : 'kh991231@naver.com'
    },
    {
        id : '4567',
        name : 'kimkim',
        email  : 'kimkeonhwi@gmail.com'
    }
 ]

 server.post('/api/create', function (req, res, next) {
    var userId = req.body['id'];
    var userPw = req.body['name'];
    var userPwRe = req.body['email'];
    con.query('insert into userdata values(?,?,?);', [userId, userPw,userPwRe], function (err, rows, fields) {
        if (!err) {
            res.send('success');
        } else {

            res.send('err : ' + err);
        }
    });
  
});

 server.get('/api/user',(req,res) => {
    res.json(users);
 }) 


 server.get('/api/user/:id', (req,res) => {
     console.log(req.params.id)
     const user = users.find((u)=>{
        return u.id === req.params.id;
     })
     if(user) {
        res.json(user);
     }
     else {
        res.status(404).json({errorMessage:"user was not found"})
     }
 })


 server.post('/api/user',(req,res) => {
    console.log(req.body);
    users.push(req.body);
     res.json(users);
 })

 server.put('/api/user/:id',(req,res) => {
    let foundIndex = users.findIndex(u=>u.id === req.params.id);
    if(foundIndex == -1 ) {
        res.status(404).json({errorMessage : 'user was not found'});
    }else {
        users[foundIndex] = {...users[foundIndex], ...req.body}
        res.json(users[foundIndex])
    }
 })

server.delete('/api/user/:id',(req,res) => {
    let foundIndex = users.foundIndex(u=> u.id === req.params.id);
    if(foundIndex === -1) {
        res.status(404).json({errorMessage : "user was not found"});
    }else {
        let foundUser = users.splice(foundIndex,1)
        res.json(foundUser[0]);
    }
})
