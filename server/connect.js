// this file is used to set up connection to mysql server
const mysql = require("mysql");
const sqlite3 = require('sqlite3').verbose();



// // create a new database connection
// db = new sqlite3.Database('dazzleDB.db', (err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Database connected successfully!');
//   }
// });


// // define the SQL statement to create a new table
// let sql = `CREATE TABLE IF NOT EXISTS students (
//   id INTEGER PRIMARY KEY,
//   name TEXT NOT NULL,
//   orderNum INTEGER
// );`;

// // execute the SQL statement
// db.run(sql, (err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   if (this.changes > 0) {
//     console.log('Table created successfully!');
//   } else {
//     console.log('Table already exists!');
//   }
// });


// create a new SQLite3 database instance
const db = new sqlite3.Database('Dazzle.db');

// execute the first query to create the items table
const createItemsTableQuery = `CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL
)`;
db.run(createItemsTableQuery, (err) => {
  if (err) throw err;
  console.log('Items table created!');

  // execute the second query to create the item_images table
  const createItemImagesTableQuery = `CREATE TABLE item_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img_url VARCHAR(255) NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (item_id)
      REFERENCES items (id)
      ON DELETE CASCADE
  )`;
  db.run(createItemImagesTableQuery, (err) => {
    if (err) throw err;
    console.log('Item images table created!');

    // execute the third query to create the item_sizes table
    const createItemSizesTableQuery = `CREATE TABLE item_sizes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      size VARCHAR(10) NOT NULL,
      qty INTEGER NOT NULL,
      FOREIGN KEY (item_id)
        REFERENCES items (id)
        ON DELETE CASCADE
    )`;
    db.run(createItemSizesTableQuery, (err) => {
      if (err) throw err;
      console.log('Item sizes table created!');

      // close the database connection
      db.close((err) => {
        if (err) throw err;
        console.log('Database connection closed!');
      });
    });
  });
});


// // close the database connection
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Database connection closed successfully!');
//   }
// });



// const db = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PWD,
//   database: process.env.MYSQL_DB,
//   port: process.env.MYSQL_PORT,
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to database!");
// });

module.exports = db;
