const mysql = require('mysql');
const config = require('config');
const db = config.get('sqlURI');

const connectDB = mysql.createPool({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'be979b445a77ff',
  password: '0472db52',
  database: 'heroku_ad9185d3992d25f',
});

module.exports = connectDB;
