const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connection = require("./config/db");
const cors = require("cors");

// swagger API documentation
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// const corsOptions = {
//   origin: "https://comp4537-front-end.herokuapp.com",
//   credentials: true,
// };

const corsConfig = (req, res, next) => {
  const urlList = [
    "https://comp4537-front-end.herokuapp.com",
    "http://localhost:3000",
  ];
  const origin = req.header.origin;
  if (urlList.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
};
//body parser
app.use(
  express.json({
    extended: false,
  })
);
app.use(corsConfig);
//default option
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://comp45 37-front-end.herokuapp.com"
//   );

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
//Define routes
app.use("/api/v1/user", require("./routes/api/user"));
app.use("/api/v1/auth", require("./routes/api/auth"));
app.use("/api/v1/posts", require("./routes/api/posts"));
app.use("/api/v1/comments", require("./routes/api/comments"));
app.use("/api/v1/admin", require("./routes/api/admin"));
app.use("/api-docs", swaggerUI.serve);

app.get("/api-docs", swaggerUI.setup(swaggerDocument));
app.get("/deleteAll", (req, res) => {
  // let sql = 'DELETE FROM comment';
  // connection.query(sql);

  let sql = "DELETE FROM post";
  connection.query(sql);

  // let sql = 'DELETE FROM user';
  // connection.query(sql);

  // sql = 'DROP TABLE image';
  // connection.query(sql);
  res.send("deleted");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
