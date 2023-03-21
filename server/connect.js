// this file is used to set up connection to sqlite database
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// this function is used to connect to the approriate database
const connectDB = (port) => {
  // connect to db file based on port. rep name based on last digit of port. 5000 => rep0.db
  const dbFile =
    port === "main" ? "./db/main.db" : `./db/rep${port.slice(-1)}.db`;

  const db = new sqlite3.Database(
    dbFile,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error(err.message);
        throw err;
      }
      console.log(`Connected to the ${dbFile}`);
    }
  );

  // clone the db
  if (port !== "main") {
    fs.copyFile("./db/main.db", `${dbFile}`, (err) => {
      if (err) throw err;
      console.log("Database replicated");
    });
  }

  exports.db = db;
};

exports.connectDB = connectDB;
