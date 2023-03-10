// this file is used to set up connection to sqlite database
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// this function is used to connect to the approriate database
const connectDB = (port) => {
  // connect to db file based on port
  const dbFile = port === 5000 ? "./db/rep1.db" : "./db/rep2.db";

  const db = new sqlite3.Database(
    dbFile,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error(err.message);
        throw err;
      }
      console.log("Connected to the database.");
    }
  );

  // clone the db
  fs.open(dbFile, (err) => {
    if (err) {
      fs.copyFile("./db/dazzleDB.db", `${dbFile}`, (err) => {
        if (err) throw err;
        console.log("Database replicated");
      });
    }
  });

  module.exports = db;
};

module.exports = connectDB;
