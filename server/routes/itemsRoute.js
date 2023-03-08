const express = require("express");
const router = express.Router();
const db = require("../connect");

// get all items
router.get("/", async (req, res) => {
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

  await db.all(sql, [], (err, result) => {
    if (err) throw err;
    else {
      const data = JSON.parse(JSON.stringify(result));
      const items = data.map((result) => ({
        name: result.name,
        price: result.price,
        imgURL: result.imgURL.split(","),
        sizes: result.sizes.split(","),
      }));
      res.status(200).json(items);
    }
  });
});

module.exports = router;
