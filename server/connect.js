// this file is used to set up connection to mysql server
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

module.exports = db;
