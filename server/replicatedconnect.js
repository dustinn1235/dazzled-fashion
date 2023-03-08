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

  replicatedDb.run(`CREATE TABLE IF NOT EXISTS "item_sizes" (
  "id" INTEGER NOT NULL,
  "name" TEXT,
  "size" TEXT,
  "qty" INTEGER,
  PRIMARY KEY ("id")
)`);

  replicatedDb.run(`CREATE TABLE IF NOT EXISTS "customer" (
  "id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "orderNum" INTEGER,
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
mainDb.each('SELECT * FROM "items"', (err, row) => {
  if (err) console.error(err.message);

  else {
    replicatedDb.run("INSERT OR IGNORE INTO items (id, name, price, imgURL, size) VALUES (?, ?, ?, ?, ?)", [row.id, row.name, row.price, row.imgURL, row.size], (err) => {
      if (err) console.error(err.message);
    });
  }
}, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Successfully replicated items table data.`);
  }
});

// Copy all data from the item_sizes table in main db to replicated db
mainDb.each('SELECT * FROM "item_sizes"', (err, row) => {
  if (err) console.error(err.message);

  else {
    replicatedDb.run("INSERT OR IGNORE INTO item_sizes (id, name, size, qty) VALUES (?, ?, ?, ?)", [row.id, row.name, row.size, row.qty], (err) => {
      if (err) console.error(err.message);
    });
  }
}, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Successfully replicated item_sizes table data.`);
  }
});

// Copy all data from the customer table in main db to replicated db
mainDb.each('SELECT * FROM "customer"', (err, row) => {
  if (err) console.error(err.message);

  else {
    replicatedDb.run("INSERT OR IGNORE INTO customer (id, name, orderNum) VALUES (?, ?, ?)", [row.id, row.name, row.orderNum], (err) => {
      if (err) console.error(err.message);
    });
  }
}, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Successfully replicated customer table data.`);
  }
});

// console.log("Successfully replicated data.");

module.exports = router;