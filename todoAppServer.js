/*
    GET
    POST
    PUT
    DELETE
 */

// 파일분할 꼭 할것.

//링크 테스트
const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const mysql = require("mysql");
const path = require("path");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

var con = require("./dbConfig/dbConfig.js");
const { query } = require("express");
const e = require("express");
const { start } = require("repl");
// console.log("console message for test commit");
// console.log("console message for test commit");
// console.log("console message for test commit");
// console.log("console message for test commit");
// console.log('commit test last')
const users = [
  {
    id: "1234",
    name: "keoni",
    email: "kh991231@naver.com",
  },
  {
    id: "4567",
    name: "kimkim",
    email: "kimkeonhwi@gmail.com",
  },
];

server.post("/api/test", function (req, res, next) {
  const testString = req.body[test];
  console.log(testString);
  con.query(
    "insert into test values(?);",
    [testString],
    function (err, rows, fields) {
      if (!err) {
        res.send(req.body);
      } else {
        res.send("err 발생");
      }
    }
  );
});
//회원가입 코드
//회원가입 코드
server.post("/todoApp/user/create", function (req, res, next) {
  const userEmail = req.body["email"];
  const userPw = req.body["pw"];
  const userName = req.body["name"];

  con.query(
    "select EXISTS (select email from user where email = ?) as success;",
    [userEmail],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success == 1) {
          // 이메일이 이미 존재하면
          res.send("이메일이 중복되었습니다.");
        } else {
          // 이메일이 존재하지 않으면
          con.query(
            "insert into user values(?,?,?);",
            [userEmail, userName, userPw],
            function (err, rows, fields) {
              if (!err) {
                res.send(req.body);
              } else {
                res.send("err 발생");
              }
            }
          );
        }
      } else {
        res.send("이메일 확인 중 에러 발생");
      }
    }
  );
});
//로그인 부분 //토큰은 아직
server.post("/todoApp/user/login", function (req, res, next) {
  var userEmail = req.body.email;
  var userPW = req.body.pw;
  con.query(
    "select EXISTS (select * from user where email = ? and pw = ?) as success;",
    [userEmail, userPW],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success != 0) {
          con.query(
            "select * from user where email = ? and pw = ?;",
            [userEmail, userPW],
            function (err, rows, fields) {
              const userdata = {
                email: rows[0].email,
                pw: rows[0].pw,
                name: rows[0].name,
              };
              res.send(userdata);
            }
          );
        } else {
          res.send("no user info");
        }
      } else {
        res.send("err 발생");
      }
    }
  );
});
//일정 추가
server.post("/todoApp/create/plan", function (req, res, next) {
  const userEmail = req.body["userEmail"];
  const selectDate = req.body("selectDate");
  const startTime = req.body["startTime"];
  const endTime = req.body["endTime"];
  const check = req.body["check"];
  const content = req.body["content"];

  // con.query(
  //   "insert into user values(?,?,?);",
  //   [userEmail, userName, userPw],
  //   function (err, rows, fields) {
  //     if (!err) {
  //       res.send(req.body);
  //     } else {
  //       res.send("err 발생");
  //     }
  //   }
  // );

  con.query(
    "insert into Plan values(description, email, checkPlan, startTime, endTime, selectDate) ;",
    [content, email, check, startTime, endTime, selectDate],
    function (err, rows, fields) {
      if (!err) {
        res.send("저장 성공!");
      } else {
        res.send("에러 발생!");
      }
    }
  );
  //con.query('ins')
});

//id, nickname 중복체크
server.post("/api/user/create/checkIDdupl", function (req, res, next) {
  const userEmail = req.body["email"];
  con.query(
    "select EXISTS (select email from user where email = ?) as success;",
    [userEmail],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success == 0) {
          res.send("이메일이 중복되었습니다");
        } else {
          res.send("cannot use");
        }
      } else {
        res.send("err 발생");
      }
    }
  );
});
server.post("/api/user/create/checkNamedupl", function (req, res, next) {
  const userName = req.body["name"];
  con.query(
    "select EXISTS (select name from user where nickName = ?) as success;",
    [userName],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success == 0) {
          res.send("can use");
        } else {
          res.send("cannot use");
        }
      } else {
        res.send("err 발생");
      }
    }
  );
});

//게시글 작성
//req에서 받은 게시클 타입에 따라 타이블에 자동 생성.
server.post("/create/board/post", function (req, res, next) {
  const boardType = req.body["boardType"];
  const userAnonyCheck = req.body["anonyCheck"];
  const writerId = req.body["id"];
  const boardTitle = req.body["boardTitle"];
  const boardContent = req.body["boardContent"];
  const createTime = req.body["createTime"];
  const schoolName = req.body["schoolName"];
  con.query(
    "insert into " + boardType + " values(?,?,?,?,?,?,?,?,?);",
    [
      boardTitle,
      boardContent,
      writerId,
      0,
      0,
      null,
      createTime,
      schoolName,
      userAnonyCheck,
    ],
    function (err, rows, fields) {
      if (!err) {
        con.query("select * from free_board;", function (err, rows, filed) {
          if (!err) {
            res.json("success");
          } else {
            res.send("err 발생");
          }
        });
      } else {
        res.send("err 발생");
      }
    }
  );
});
//자유 게시판 전체 글 조회
server.get("/Get/board/get:boardType", function (req, res, next) {
  const boardType = req.params.boardType;
  con.query("select * from " + boardType + ";", function (err, rows, filed) {
    if (!err) {
      res.json(rows);
    } else {
      res.send("err 발생");
    }
  });
});

//자유게시판 특정 게시판 클릭 조회. (게시글 내용 + 댓글 정보들)
//댓글과 함께 보여줘여함.
server.get("/Get/board/post/:postId", function (req, res, next) {
  const postId = req.params.postId;
  console.log(postId);
  con.query(
    "select * from free_board_repl where post_id = ?",
    [postId],
    function (err, rows, fields) {
      if (!err) {
        res.send(rows);
        console.log(rows);
      } else {
        res.send("err 발생");
      }
    }
  );
});
//게시글 댓글 작성
server.post("/Post/board/repl/:postId", function (req, res, next) {
  const replContent = req.body["replContent"];
  const replWriterId = req.body["replWriterId"];
  const repledTime = req.body["repledTime"];
  const boardType = req.body["boardType"];
  const postId = req.params.postId;
  con.query(
    "insert into " + boardType + "_repl" + " values(?,?,?,?,?,?);",
    [null, 0, replContent, replWriterId, repledTime, postId],
    function (err, rows, fields) {
      if (!err) {
        con.query("select * from free_board;", function (err, rows, filed) {
          if (!err) {
            res.json("success");
          } else {
            res.send("err 발생");
          }
        });
      } else {
        res.send("err 발생");
      }
    }
  );
});

//회원 정보 수정하기 전에 회원정보 인증
//닉네임, 이메일
server.post("/user/account/checker", function (req, res, next) {
  const userId = req.body["id"];
  const userPw = req.body["pw"];
  con.query(
    "select EXISTS (select * from user where id = ? and pw = ?) as success;",
    [userId, userPw],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success != 0) {
          res.send("success");
        } else {
          res.send("no user info");
        }
      }
    }
  );
});

//회원정보 수정 (비밀번호)
//계정 인증 후 이상없음 비밀 번호 변경.
server.put("/user/change/info/password", function (req, res, next) {
  const userId = req.body["id"];
  const userOldPw = req.body["oldPw"];
  const userNewPw = req.body["newPw"];
  con.query(
    "select EXISTS (select * from user where id = ? and pw = ?) as success;",
    [userId, userOldPw],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success != 0) {
          con.query(
            'update user set pw= "' +
              userNewPw +
              '" where id = "' +
              userId +
              '";',
            function (err, rows, fields) {
              if (!err) {
                res.send("success");
              } else {
                res.send("err 발생");
              }
            }
          );
        } else {
          res.send("no user info");
        }
      } else {
        res.send("no user info");
      }
    }
  );
});

//회원정보 수정 (닉네임)
server.put("/user/change/info/nickName", function (req, res, next) {
  const userOldNick = req.body["userOldNick"];
  const userNewNick = req.body["userNewNick"];
  con.query(
    'select EXISTS (select * from user where nickName = "' +
      userNewNick +
      '") as success;',
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success == 0) {
          con.query(
            'update user set nickName= "' +
              userNewNick +
              '" where nickName = "' +
              userOldNick +
              '";',
            function (err, rows, fields) {
              if (!err) {
                res.send("success");
              } else {
                res.send("err 발생");
              }
            }
          );
        }
      } else {
        res.send("err 발생");
      }
    }
  );
});
server.put("/user/change/info/email", function (req, res, next) {
  const userOldEmail = req.body["userOldEmail"];
  const userNewEmail = req.body["userNewEmail"];
  const userId = req.body["userId"];
  con.query(
    'select EXISTS (select * from user where nickName = "' +
      userNewEmail +
      '" and id = "' +
      userId +
      '") as success;',
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success == 0) {
          con.query(
            'update user set email = "' +
              userNewEmail +
              '" where email = "' +
              userOldEmail +
              '" and id = "' +
              userId +
              '";',
            function (err, rows, fields) {
              if (!err) {
                res.send("success");
              } else {
                res.send("err 발생");
              }
            }
          );
        }
      } else {
        //console.log(err);
        res.send("err 발생");
      }
    }
  );
});

server.listen(3000, () => {
  console.log("!!server is running!!");
});

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
