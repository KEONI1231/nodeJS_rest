const con = require("../dbConfig/dbConfig.js");

exports.getFriends = function (req, res, next) {
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
          res.send("친구 목록 없음");
        }
      } else {
        console.log(err);
        res.send("에러발생");
      }
    }
  );
};

exports.searchFriends = function (req, res, next) {
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
};
exports.addFriend = function (req, res, next) {
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
};
exports.startChatting = function (req, res, next) {
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
};
exports.getChatList = function (req, res, next) {
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
};
exports.getChatContents = function (req, res, next) {
  const userEmail = req.query.userEmail;
  const friendEmail = req.query.friendEmail;

  let i = 0;
  let responseData = {};
  con.query(
    "SELECT * FROM ChatLists WHERE (a_email = ? AND b_email = ?) OR (a_email = ? AND b_email = ?) ORDER BY time ASC;",
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
};
