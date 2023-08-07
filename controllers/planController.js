const con = require("../dbConfig/dbConfig.js");

exports.createPlan = function (req, res, next) {
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
};
exports.getPlanDate = function (req, res, next) {
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
};

exports.deletePlan = function (req, res, next) {
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
};

exports.updateCheck = function (req, res, next) {
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
};

exports.updatePlan = function (req, res, next) {
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
};

exports.getPlan = function (req, res, next) {
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
};
