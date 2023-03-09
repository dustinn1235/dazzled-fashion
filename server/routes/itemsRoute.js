const express = require("express");
const router = express.Router();
const db = require("../connect");

// get all items
router.get("/", (req, res) => {
  let sql = `
    SELECT
      items.name AS name,
      items.price AS price,
      GROUP_CONCAT(DISTINCT item_images.img_url) AS imgURL,
      GROUP_CONCAT(DISTINCT item_sizes.size) AS sizes
    FROM items
    LEFT JOIN item_images ON items.id = item_images.item_id
    LEFT JOIN item_sizes ON items.id = item_sizes.item_id
    GROUP BY items.id;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    } else {
      const items = rows.map((row) => ({
        name: row.name,
        price: row.price,
        imgURL: row.imgURL ? row.imgURL.split(",") : [],
        sizes: row.sizes ? row.sizes.split(",") : [],
      }));
      res.status(200).json(items);
    }
  });
});

module.exports = router;