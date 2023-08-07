const con = require("../dbConfig/dbConfig.js");

module.exports = function (io) {
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
    // socket.emit("message", {
    //   user: "admin",
    //   message: "Welcome to " + roomName,
    // });
  });
  //"insert into Plan (description, email, checkPlan, startTime, endTime, selectDate) values(?, ?, ?, ?, ?, ?)",
  //    [content, userEmail, check, startTime, endTime, selectDate],
  socket.on("sendMessage", ({ friendEmail, userEmail, userName, message }) => {
    console.log(message);
    let now = new Date(); // 현재 시간 (UTC)
    let offset = 9 * 60 * 60 * 1000; // 9시간 (밀리초 단위)

    let koreaTime = new Date(now.getTime() + offset); // 한국 시간
    let year = koreaTime.getUTCFullYear();
    let month = (koreaTime.getUTCMonth() + 1).toString().padStart(2, "0");
    let day = koreaTime.getUTCDate().toString().padStart(2, "0");
    let hours = koreaTime.getUTCHours().toString().padStart(2, "0");
    let minutes = koreaTime.getUTCMinutes().toString().padStart(2, "0");
    let seconds = koreaTime.getUTCSeconds().toString().padStart(2, "0");

    let datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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
                a_email: userEmail,
                b_email: friendEmail,
                a_name: userName,
                b_name: b_name,
                sender: userEmail,

                contents: message,
                time: datetime,
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
};
