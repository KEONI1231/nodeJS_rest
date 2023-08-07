const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const server = express();
const httpServer = http.createServer(server);
const io = socketIo(httpServer);

const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const planRouter = require("./routes/plan");
const socketHandler = require("./routes/socketHandler");

server.use(cors()); // And add this line
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

server.use("/user", userRouter);
server.use("/chat", chatRouter);
server.use("/plan", planRouter);

socketHandler(io);
var con = require("./dbConfig/dbConfig.js");

httpServer.listen(3000, () => {
  console.log("!!server is running!!");
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
// `SELECT Friends.friend_id, ChatUser.name, ChatUser.statusMessage
// FROM Friends
// INNER JOIN ChatUser ON Friends.friend_id = ChatUser.email
// WHERE Friends.user_id = ? or Friends.friend_id = ?;`,

//id, nickname 중복체크
