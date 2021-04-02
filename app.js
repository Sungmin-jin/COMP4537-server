const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connection = require('./config/db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
//body parser
app.use(
  express.json({
    extended: false,
  })
);

//default option
app.use(fileUpload());
app.use(cors());

//Define routes
app.use('/api/v1/user', require('./routes/api/user'));
app.use('/api/v1/auth', require('./routes/api/auth'));
app.use('/api/v1/posts', require('./routes/api/posts'));
app.use('/api/v1/comments', require('./routes/api/comments'));
app.use('/api/v1/admin', require('./routes/api/admin'));

app.get('/deleteAll', (req, res) => {
  let sql = 'DELETE FROM user';
  connection.query(sql);
  res.send('deleted');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
