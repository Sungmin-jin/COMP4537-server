const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
require("./src/database/connection");
// const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

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

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("user is connect");

  socket.on("join", (userId) => {
    addUser(userId, socket.id);
    console.log("join", socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendChat", ({ senderId, receiverId, chatText }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getChat", {
        senderId,
        chatText,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user is disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));

// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
// });
