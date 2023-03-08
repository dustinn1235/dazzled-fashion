const sqlite3 = require('sqlite3').verbose();

// Create a new database file for the replicated database
const replicatedDb = new sqlite3.Database("./db/replicatedDazzle.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the replicated database.");
  });
  
  // Create a new table in the replicated database that matches the structure of the table in the main database
  replicatedDb.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, image TEXT)");
module.exports = replicatedDb;
