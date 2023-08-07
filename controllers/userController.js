const con = require("../dbConfig/dbConfig.js");

exports.createUser = function (req, res, next) {
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
};
exports.loginUser = function (req, res, next) {
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
};

exports.createChatUser = function (req, res, next) {
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
};
exports.loginChatUser = function (req, res, next) {
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
};
