// this file is used to set up connection to sqlite database
const sqlite3 = require("sqlite3").verbose();

// this function is used to clone the database
const cloneDB = (db) => {
  const itemTableQuery = `
  CREATE TABLE if not exists items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
  );`;

  const itemImgTableQuery = `
  CREATE TABLE if not exists item_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img_url VARCHAR(255) NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (item_id)
      REFERENCES items (id)
      ON DELETE CASCADE
  );`;

  const itemSizeTableQuery = `
  CREATE TABLE if not exists item_sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    size VARCHAR(10) NOT NULL,
    qty INTEGER NOT NULL,
    FOREIGN KEY (item_id)
      REFERENCES items (id)
      ON DELETE CASCADE
  );`;

  db.run(itemTableQuery);
  db.run(itemImgTableQuery);
  db.run(itemSizeTableQuery);

  // Connect to the main database
  const mainDb = new sqlite3.Database(
    "./db/dazzleDB.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) console.error(err.message);
      // else console.log("Connected to the main database.");
    }
  );

  // Copy all data from the items table in the main database to the replicated database
  mainDb.each(
    'SELECT * FROM "items"',
    (err, row) => {
      if (err) console.error(err.message);
      else {
        db.run(
          "INSERT OR IGNORE INTO items (id, name, price) VALUES (?, ?, ?)",
          [row.id, row.name, row.price, row.imgURL, row.size],
          (err) => {
            if (err) console.error(err.message);
          }
        );
      }
    },
    (err) => {
      if (err) console.error(err.message);
      else console.log(`Successfully replicated item_sizes table data.`);
    }
  );

  // Copy all data from the item_imgages table in main db to replicated db
  mainDb.each(
    'SELECT * FROM "item_images"',
    (err, row) => {
      if (err) console.error(err.message);
      else {
        db.run(
          "INSERT OR IGNORE INTO item_images (id, img_url, item_id) VALUES (?, ?, ?)",
          [row.id, row.img_url, row.item_id],
          (err) => {
            if (err) console.error(err.message);
          }
        );
      }
    },
    (err) => {
      if (err) console.error(err.message);
      else console.log(`Successfully replicated item_images table data.`);
    }
  );

  // Copy all data from the item_sizes table in main db to replicated db
  mainDb.each(
    'SELECT * FROM "item_sizes"',
    (err, row) => {
      if (err) console.error(err.message);
      else {
        db.run(
          "INSERT OR IGNORE INTO item_sizes (id, item_id, size, qty) VALUES (?, ?, ?, ?)",
          [row.id, row.item_id, row.size, row.qty],
          (err) => {
            if (err) console.error(err.message);
          }
        );
      }
    },
    (err) => {
      if (err) console.error(err.message);
      else console.log(`Successfully replicated item_sizes table data.`);
    }
  );
};

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
  cloneDB(db);

  module.exports = db;
};

module.exports = connectDB;
