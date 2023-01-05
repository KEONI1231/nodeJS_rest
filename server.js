 /*
    GET
    POST
    PUT
    DELETE
 */
 

// 파일분할 꼭 할것.



 const express = require('express');
 const bodyParser = require('body-parser'); 
 const server = express();
 const mysql = require('mysql');
 const path = require('path');

 server.use(bodyParser.json());
 server.use(bodyParser.urlencoded({extended: true}));
 server.use(express.json())


var con = require('./dbConfig.js');

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

 //회원가입 코드
 server.post('/api/create', function (req, res, next) {
    const userId = req.body['id'];
    const userPw = req.body['pw'];
    const userNickName = req.body['nickName'];
    const userName = req.body['name'];
    const userSchoolName = req.body['schoolName'];
    const userSchoolCode = req.body['schoolCode'];
    const userIsAdmin = req.body['isAdmin'];
    const userIsCertificated = req.body['isCertificated'];
    const userCreatedTime = req.body['createTime'];
    const userPostCount = req.body['postCount'];
    const userReplCount = req.body['replCount'];
    const userEmail = req.body['email'];

    con.query('insert into user values(?,?,?,?,?,?,?,?,?,?,?,?);', [userId, userPw, userNickName, userName, userSchoolName,
         userSchoolCode, userIsAdmin, userIsCertificated, userCreatedTime, userReplCount, userPostCount, userEmail], function (err, rows, fields) {
        if (!err) {
            res.send(req.body);
        }else {
            res.send('err 발생');
        }
    });
});

//id, nickname 중복체크
server.post('/api/create/checkIDdupl', function (req, res, next) {
    const userId = req.body['id'];
    console.log(userId);
    con.query('select EXISTS (select id from user where id = ?) as success;', [userId], function (err, rows, fields) {
        if (!err) {
            if(rows[0].success == 0)
            {
                console.log(rows)
                res.send('can use');
            }
            else {
                res.send('cannot use');    
            }
        }else {
            res.send('err 발생');
        }
    });
});
server.post('/api/create/checkNickNamedupl', function (req, res, next) {
    const userNickName = req.body['nickName'];
    console.log(userNickName);
    con.query('select EXISTS (select nickName from user where nickName = ?) as success;', [userNickName], function (err, rows, fields) {
        if (!err) {
            if(rows[0].success == 0)
            {
                console.log(rows)
                res.send('can use');
            }
            else {
                res.send('cannot use');    
            }
        }else {
            res.send('err 발생');
        }
    });
});

server.get('/api/user',(req,res) => {
    con.query('select * from user', function(err, row, fields) {
        console.log(row)
        res.json('sdaf');    
    })
 }) 

server.listen(3000, () => {
    console.log("!!server is running!!");
}) 






















































/*
 server.get('/api/user/user_login/:id', (req,res) => {
     var userID = req.body.id;
     var userPW = req.body.name;
     con.query('select * from userdata where id = ?', [userID], function(err, row, fields) {
        if(!err){
            console.log(row)    
            res.json(row)
        }
        else{
            res.json("faild")
        }
     })
     console.log(req.params.id)

    
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
*/