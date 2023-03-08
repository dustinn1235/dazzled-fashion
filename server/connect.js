// this file is used to set up connection to mysql server
const mysql = require("mysql");

const sqlite3 = require("sqlite3").verbose();

/* 
  - Can open the database in memory or on disk. We can create an in memory version  for read operations (forgot exactly what the TA said)
    - Disk version to be stored and updated with the server

  - Can open the database in 3 ways
    - Read only (sqlite3.OPEN_READONLY)
    - Read and write (sqlite3.OPEN_READWRITE)
    - Read and write, create if it doesn't exist (sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
      - Opens the database. If it doesnt exist it will create a new one
*/
let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});


// q: what does db.serialize do?

// db.serialize(() => {
//   db.run(S
//     'CREATE TABLE IF NOT EXISTS')
// });

module.exports = db;
