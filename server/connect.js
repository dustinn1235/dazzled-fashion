// this file is used to set up connection to sqlite database
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./db/dazzleDB.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
    console.log("Connected to the database.");
  }
);

module.exports = db;
