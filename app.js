const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
require("./src/database/connection");
// const socketio = require("socket.io");
// // const http = require("http");
// const server = http.createServer(app);
// const io = socketio(server, { cors: { origin: "*" } });
// const ChatRoom = require("./src/models/ChatRoom");

// swagger API documentation
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const sequelize = require("./src/database/connection");

//body parser
app.use(
  express.json({
    extended: false,
  })
);
app.use(cors("*"));
app.use("/api/v1/user", require("./routes/api/user"));
app.use("/api/v1/auth", require("./routes/api/auth"));
app.use("/api/v1/posts", require("./routes/api/posts"));
app.use("/api/v1/comments", require("./routes/api/comments"));
app.use("/api/v1/chatroom", require("./routes/api/chatRoom"));
app.use("/api/v1/chat", require("./routes/api/chat"));

app.use("/api-docs", swaggerUI.serve);

app.get("/api-docs", swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
  sequelize.query("delete from chat");
  return res.send("good");
});

// io.on("connection", (socket) => {
//   console.log("We have a new connection!");

//   // socket.on("join", ({ chatId }, callback) => {
//   //   console.log("chatId", chatId);
//   //   callback({ chats: "chats" });
//   // });

//   socket.on("craete", (room) => {
//     socket.join(room);
//   });

//   socket.on("disconnect", () => {
//     console.log("user had left!!!");
//   });
// });

app.listen(PORT, () => console.log(`server running on ${PORT}`));

// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
// });
