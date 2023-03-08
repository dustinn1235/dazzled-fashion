const sqlite3 = require('sqlite3').verbose();
const express = require("express");
const router = express.Router();


// Create a new database file for the replicated database
const replicatedDb = new sqlite3.Database("./db/replicatedDazzle.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the replicated database.");
  });
  
  // Create a new table in the replicated database that matches the structure of the table in the main database
  replicatedDb.run(`CREATE TABLE IF NOT EXISTS "items" (
  "id" INTEGER NOT NULL,
  "name" TEXT,
  "price" NUMBER,
  "imgURL" TEXT,
  "size" text,
  PRIMARY KEY ("id")
)`);


// Connect to the main database
const mainDb = new sqlite3.Database("./db/dazzleDB.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
      console.error(err.message);
  }
  console.log("Connected to the main database.");
});

// Copy all data from the items table in the main database to the replicated database
mainDb.all('SELECT * FROM "items"', (err, rows) => {
console.log("test");
if (err) {
  console.error(err.message);
  return;
}
rows.forEach((row) => {
  replicatedDb.run("INSERT INTO items (id, name, price, imgURL, size) VALUES (?, ?, ?, ?, ?)", [row.id, row.name, row.price, row.imgURL, row.size], (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});
// Close both database connections
mainDb.close();
replicatedDb.close();
console.log("Successfully copied data from main database to replicated database.");
});
  // replicatedDb.run("CREATE TABLE IF NOT EXISTS item_sizes (id INTEGER NOT NULL, name TEXT, size TEXT, qty INTEGER, PRIMARY KEY (id))");
  // replicatedDb.run("CREATE TABLE IF NOT EXISTS customer (id INTEGER NOT NULL, name TEXT NOT NULL, orderNum INTEGER, PRIMARY KEY (id))");
module.exports = router;