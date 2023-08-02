const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const mysql = require("mysql");
const path = require("path");
const socketIo = require("socket.io");
const cors = require("cors"); // Add this line

const server = express();
const httpServer = http.createServer(server);
const io = socketIo(httpServer);

//server.use(cors()); // And add this line
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

var con = require("./dbConfig/dbConfig.js");
const { query } = require("express");
const e = require("express");
const { start } = require("repl");

//socket code
io.on("connection", (socket) => {
  console.log("a user connected");
  let today = new Date();

  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜
  let day = today.getDay(); // 요일
  console.log(year + "/" + month + "/" + date + "/" + day);
  const finalDate = year + "년" + month + "월" + date + "일" + day;
  socket.on("join", ({ userEmail, friendEmail }) => {
    const roomName = [userEmail, friendEmail].sort().join("-");

    socket.join(roomName); // 이 사용자를 룸에 추가

    console.log(`User joined: ${roomName}`);
    socket.emit("message", {
      user: "admin",
      text: "Welcome to " + roomName,
    });
  });
  //"insert into Plan (description, email, checkPlan, startTime, endTime, selectDate) values(?, ?, ?, ?, ?, ?)",
  //    [content, userEmail, check, startTime, endTime, selectDate],
  socket.on("sendMessage", ({ friendEmail, userEmail, userName, message }) => {
    console.log(message);
    let now = new Date();
    let datetime = now.toISOString().slice(0, 19).replace("T", " ");

    const roomName = [userEmail, friendEmail].sort().join("-");

    const query1 = "select name from  ChatUser where email = ?;";
    con.query(query1, [friendEmail], (err, rows, result) => {
      if (!err) {
        const b_name = rows[0].name;
        con.query(
          "insert into ChatLists (contents, sender, time, a_name, b_name, a_email, b_email) values(?,?,?,?,?,?,?);",
          [
            message,
            userEmail,
            datetime,
            userName,

            b_name,
            userEmail,
            friendEmail,
          ],

          function (err, rows1, fields) {
            if (!err) {
              socket.to(roomName).emit("message", {
                a_email: rows1[0].a_email,
                b_email: rows1[0].b_email,
                a_name: rows1[0].a_name,
                b_name: rows1[0].b_name,
                sender: rows1[0].sender,

                contents: rows1[0].contents,
                time: rows1[0].time,
              });
            } else {
              console.log(err);
              socket.to(roomName).emit("message", {
                user: "admin",
                text: "error1",
              });
            }
          }
        );
      } else {
        socket.to(roomName).emit("message", {
          user: "admin",
          text: "error2",
        });
      }
    });

    // socket.to(roomName).emit("sendMessage", {});
    //const { chat_id, sender_email, receiver_email, message } = msg;

    // const query =
    //   "INSERT INTO chat_messages (chat_id, sender_email, receiver_email, message) VALUES (?, ?, ?, ?)";
    // con.query(
    //   query,
    //   [chat_id, sender_email, receiver_email, message],
    //   (err, result) => {
    //     if (err) throw err;

    //     io.to(chat_id).emit("receivedMessage", msg);
    //   }
    // );
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

///rest api코드

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

server.post("/todoApp/create/plan", function (req, res, next) {
  const userEmail = req.body["userEmail"];
  const selectDate = req.body["selectDate"];
  const startTime = req.body["startTime"];
  const endTime = req.body["endTime"];
  const check = req.body["check"];
  const content = req.body["content"];

  con.query(
    "insert into Plan (description, email, checkPlan, startTime, endTime, selectDate) values(?, ?, ?, ?, ?, ?)",
    [content, userEmail, check, startTime, endTime, selectDate],
    function (err, rows, fields) {
      if (!err) {
        res.send("저장 성공!");
      } else {
        console.log(err);
        res.send("에러 발생!");
      }
    }
  );
  //con.query('ins')
});

server.get("/todoApp/getPlanDate", function (req, res, next) {
  const userEmail = req.query.userEmail;
  let i = 0;
  let planedDate = {};
  console.log("진입");
  con.query(
    "select selectDate from Plan where email = ?;",
    [userEmail],
    function (err, rows, fields) {
      if (!err) {
        if (rows.length != 0) {
          for (i = 0; i < rows.length; i++) {
            console.log(i);
            planedDate[i] = {
              selectDate: rows[i].selectDate,
            };
          }
          console.log("exit");
          console.log(planedDate);
          for (i = 0; i < planedDate.length; i++) {
            console.log(planedDate[i]);
          }
          res.send(planedDate);
        }
      } else {
        console.log("no plan data");
        res.send("no plan data");
      }
    }
  );
});
server.delete("/todoApp/delete-plan", function (req, res, next) {
  const userEmail = req.query.userEmail;
  const table_id = req.query.id;

  con.query(
    "delete from Plan where email=? and id=?;",
    [userEmail, table_id],
    function (err, rows, filed) {
      if (!err) {
        console.log("ok");
        res.send("삭제완료");
      } else {
        console.log("fail");
        res.send("에러 발생");
      }
    }
  );
});
server.put("/todoApp/update-check", function (req, res, next) {
  const userEmail = req.body.userEmail;
  const selectDate = req.body.selectDate;
  const checkPlan = req.body.checkPlan;
  const id = req.body.id;
  con.query(
    "update Plan set checkPlan = ? where email = ? and selectDate = ? and id = ?",
    [checkPlan, userEmail, selectDate, id],
    function (err, rows, field) {
      if (!err) {
        console.log("성공");
        res.send("성공");
      } else {
        console.log("에러 발생");
        res.send("에러 발생");
      }
    }
  );
});
server.put("/todoApp/update-plan", function (req, res, next) {
  const userEmail = req.body.userEmail;
  const table_id = req.body.id;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const check = req.body.checkPlan;
  const description = req.body.description;
  con.query(
    "update Plan set startTime=? , endTime = ?, checkPlan = ?, description = ? where userEmail = ? and id = ?;",
    [startTime, endTime, check, description, userEmail, table_id],
    function (err, rows, field) {
      if (!err) {
        console.log("업데이트 성공");
        res.send("성공");
      } else {
        console.log("업데이트 에러 발생");
        res.send("실패");
      }
    }
  );
});

//회원가입 코드
server.post("/smallchat/user/create", function (req, res, next) {
  const userEmail = req.body["email"];
  const userPw = req.body["pw"];
  const userName = req.body["name"];
  const userStatusMessage = req.body["statusMessage"];

  con.query(
    "select EXISTS (select email from ChatUser where email = ?) as success;",
    [userEmail],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success == 1) {
          // 이메일이 이미 존재하면
          res.send("이메일이 중복되었습니다.");
        } else {
          // 이메일이 존재하지 않으면
          con.query(
            "insert into ChatUser values(?,?,?,?);",
            [userEmail, userStatusMessage, userPw, userName],
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
server.post("/smallchat/user/login", function (req, res, next) {
  var userEmail = req.body.email;
  var userPW = req.body.pw;
  con.query(
    "select EXISTS (select * from ChatUser where email = ? and pw = ?) as success;",
    [userEmail, userPW],
    function (err, rows, fields) {
      if (!err) {
        if (rows[0].success != 0) {
          con.query(
            "select * from ChatUser where email = ? and pw = ?;",
            [userEmail, userPW],
            function (err, rows, fields) {
              const userdata = {
                email: rows[0].email,
                pw: rows[0].pw,
                name: rows[0].name,
                statusMessage: rows[0].statusMessage,
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

// `SELECT Friends.friend_id, ChatUser.name, ChatUser.statusMessage
// FROM Friends
// INNER JOIN ChatUser ON Friends.friend_id = ChatUser.email
// WHERE Friends.user_id = ? or Friends.friend_id = ?;`,
server.get("/small-chat/get-friends", function (req, res, next) {
  const userEmail = req.query.userEmail;
  const rowFriendsEmailList = {};
  let friendsList = {};
  con.query(
    `
    SELECT * 
    FROM (
      SELECT friend_id as email FROM Friends WHERE user_id = ?
      UNION
      SELECT user_id as email FROM Friends WHERE friend_id = ?
    ) AS friends
    JOIN ChatUser
    ON friends.email = ChatUser.email
    `,
    [userEmail, userEmail],
    function (err, rows, fields) {
      if (!err) {
        console.log(rows);
        if (rows.length != 0) {
          rows.forEach((row, i) => {
            friendsList[i] = {
              f_email: row.email,
              f_name: row.name,
              f_statusMessage: row.statusMessage,
            };
          });
          res.send(friendsList);
        } else {
          console.log("친구목록 없음");
          res.sen("친구 목록 없음");
        }
      } else {
        console.log(err);
        res.send("에러발생");
      }
    }
  );
});

server.get("/smallchat/search-friends", function (req, res, next) {
  const searchEmail = req.query.searchEmail;
  const userEmail = req.query.userEmail;
  let friendList = {};
  con.query(
    "select * from Friends where user_id = ? and friend_id = ?",
    [userEmail, searchEmail],

    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 1) {
          res.send("이미 친구 추가가 완료되었습니다.");
        } else {
          con.query(
            "select name, email from ChatUser where email = ?",
            [searchEmail],
            function (err, rows, fileds) {
              if (!err) {
                if (rows.length == 1) {
                  friendList[0] = {
                    f_email: rows[0].email,
                    f_name: rows[0].name,
                  };
                  res.send(friendList);
                } else {
                  res.send("검색 실패");
                }
              } else {
                console.log(err);
                res.send("에러발생");
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
});
server.post("/small-chat/add-friend", function (req, res, next) {
  const user_email = req.body["userEmail"];
  const search_email = req.body["searchEmail"];

  con.query(
    "insert into Friends values(?,?);",
    [user_email, search_email],
    function (err, rows, fields) {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    }
  );
});
server.post("/small-chat/startchatting", function (req, res, next) {
  const me = req.body["userEmail"];
  const you = req.body["friendEmail"];

  con.query(
    "select * from ChatConnects where a_email = ? and b_email = ?;",
    [me, you],
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          con.query(
            "insert into ChatConnects (a_email, b_email) values(?, ?)",
            [me, you],
            function (err, rows, fields) {
              if (!err) {
                res.send("저장 성공!");
              } else {
                console.log(err);
                res.send("에러 발생!");
              }
            }
          );
        } else {
          res.send("this point");
        }
      } else {
        console.log(err);
        res.send("에러");
      }
    }
  );
});
server.post("/small-chat/getChatList", function (req, res, next) {
  const me = req.body["userEmail"];
  let i = 0;
  let chatList = {};

  con.query(
    `
    SELECT ChatConnects.*, ChatUser.name 
    FROM (
      SELECT * FROM ChatConnects WHERE a_email = ?
      UNION
      SELECT * FROM ChatConnects WHERE b_email = ?
    ) AS ChatConnects 
    JOIN ChatUser 
    ON CASE WHEN ChatConnects.a_email = ? THEN ChatConnects.b_email ELSE ChatConnects.a_email END = ChatUser.email
    `,
    [me, me, me],

    function (err, rows, fields) {
      if (!err) {
        if (rows.length != 0) {
          for (let i = 0; i < rows.length; i++) {
            console.log(i);
            if (rows[i].a_email == me) {
              chatList[i] = {
                userEmail: rows[i].a_email,
                b_email: rows[i].b_email,
                id: rows[i].id,
                name: rows[i].name,
              };
            } else {
              chatList[i] = {
                userEmail: rows[i].b_email,
                b_email: rows[i].a_email,
                id: rows[i].id,
                name: rows[i].name,
              };
            }
          }
          console.log("exit");
          console.log(chatList);
          for (let i = 0; i < chatList.length; i++) {
            console.log(chatList[i]);
          }
          res.send(chatList);
        }
      } else {
        console.log(err);
        console.log("no plan data");
        res.send("no plan data");
      }
    }
  );
});
//일정 추가
server.get("/get-chat-contents", function (req, res, next) {
  const userEmail = req.query.userEmail;
  const friendEmail = req.query.friendEmail;

  let i = 0;
  let responseData = {};
  con.query(
    "SELECT * FROM ChatLists WHERE (a_email = ? AND b_email = ?) OR (a_email = ? AND b_email = ?) ORDER BY time DESC;",
    [userEmail, friendEmail, friendEmail, userEmail],
    function (err, rows, fields) {
      if (!err) {
        if (rows.length != 0) {
          console.log(rows);
          for (i = 0; i < rows.length; i++) {
            responseData[i] = {
              id: rows[i].id,
              contents: rows[i].contents,
              sender: rows[i].sender,
              time: rows[i].time,
              a_name: rows[i].a_name,
              b_name: rows[i].b_name,
              a_email: rows[i].a_email,
              b_email: rows[i].b_email,
            };
          }
          res.send(responseData);
        } else {
          res.send("fail");
        }
      } else {
        console.log(err);
        res.send("error");
      }
    }
  );
});

//모든 일정 불러오기
server.get("/todoApp/getPlan", function (req, res, next) {
  const userEmail = req.query.userEmail;
  const selectDate = req.query.selectDate;
  let i = 0;
  let planData = {};
  con.query(
    "select * from Plan where email = ? and selectDate = ?;",
    [userEmail, selectDate],
    function (err, rows, fileds) {
      if (!err) {
        if (rows.length != 0) {
          for (i = 0; i < rows.length; i++) {
            planData[i] = {
              userEmail: rows[i].email,
              selectDate: rows[i].selectDate,
              checkPlan: rows[i].checkPlan,
              startTime: rows[i].startTime,
              endTime: rows[i].endTime,
              description: rows[i].description,
              id: rows[i].id,
            };
            //console.log(userEmail);
            //console.log(selectDate);
          }
          res.send(planData);
        } else {
          res.send("no plan data");
        }
      } else {
        res.send("no plan data");
        console.log("에러가 발생했습니다.");
      }
    }
  );
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

httpServer.listen(3000, () => {
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
