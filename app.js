const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connection = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const fileUpload = require("express-fileupload");
//body parser
app.use(
  express.json({
    extended: false,
  })
);

//default option
app.use(fileUpload());

//Define routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/comments", require("./routes/api/comments"));

app.get("/deleteAll", (req, res) => {
  let sql = "DELETE FROM user";
  connection.query(sql);
  res.send("deleted");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
