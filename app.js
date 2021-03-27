const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connection = require('./config/db');

//body parser
app.use(
  express.json({
    extended: false,
  })
);

//Define routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('/deleteAll', (req, res) => {
  let sql = 'DELETE FROM user';
  connection.query(sql);
  res.send('deleted');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
