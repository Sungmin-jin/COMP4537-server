const mysql = require('mysql');
const config = require('config');
const db = config.get('sqlURI');

const connectDB = mysql.createPool(db);

module.exports = connectDB;
