const express = require("express");
const router = express.Router();
const db = require("../connect");

// check if items are available
router.post("/", async (req, res) => {
  // TODO add data validation
  // TODO create order table and add the following order to the database
  if (!req) res.status(418).send({ message: "Invalid data!" });
  // arrray to store items that are out of stock
  const outOfStockItems = [];

  // loop through each item in the request body
  for (const item of req.body.items) {

    const name = item.name;
    const size = item.size;
    const qty = item.qty;
    // query the database to get the qty of the item
    let sql = `
      SELECT item_sizes.size, item_sizes.qty
      FROM item_sizes
      JOIN items ON item_sizes.item_id = items.id
      WHERE items.name = "${item.name}" AND item_sizes.size = "${item.size}";
    `;
    // wait for the query to finish
    await new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // no error
          // if the item is found in the database
          if (results.length > 0) {
            console.log("item found and no error!");
            console.log(results); // print out the results

            // if the qty of the item is greater than or equal to the qty in the request body
            if (results[0].qty >= item.qty) {
              console.log("item is available");
              let update = `
                UPDATE item_sizes
                JOIN items ON item_sizes.item_id = items.id
                SET item_sizes.qty = (item_sizes.qty - ${qty})
                WHERE items.name = "${name}" AND item_sizes.size = "${size}";`;

              db.query(update, (err, result) => {
                if (err) throw err;
              });
              resolve();



            }
            // if the qty of the item is less than the qty in the request body 
            else {
              console.log("item not available");
              outOfStockItems.push({
                name: item.name,
                size: item.size,
                qty: results[0].qty
              });
              resolve();
            }
          }
          // if the item is not found in the database 
          else {
            console.log("item not found but no error");
            reject("Item is not available");
          }
        }
      });
    });

  }

  // if there are items that are out of stock
  if (outOfStockItems.length > 0) {
    console.log("out of stock items below");
    console.log(outOfStockItems);
    res.status(400).json({
      message: "Some items are not available",
      unavailableItems: outOfStockItems
    });

  // if all items are available
  } else {
    console.log(req.body);
    res.status(200).json({ message: "All items are available" });
  }
});

module.exports = router;




