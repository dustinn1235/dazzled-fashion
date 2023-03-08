const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const replicatedDb = require("../replicatedconnect");


router.post("/copydatabase", (req, res) => {

    // Connect to the main database
    const mainDb = new sqlite3.Database("./db/dazzleDB.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the main database.");
    });

    // Copy all data from the items table in the main database to the replicated database
    mainDb.serialize(() => {
        mainDb.each("SELECT * FROM items", (err, row) => {
          if (err) {
            console.error(err.message);
          }
          replicatedDb.run("INSERT INTO items (name, description, price, image) VALUES (?, ?, ?, ?)", [row.name, row.description, row.price, row.image], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        }, () => {
          // Close both database connections
          mainDb.close();
          replicatedDb.close();
          console.log("Successfully copied data from main database to replicated database.");
        });
    });
});

module.exports = router;
