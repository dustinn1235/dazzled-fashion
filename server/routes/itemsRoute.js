const express = require("express");
const router = express.Router();
const db = require("../connect");

// get all items
router.get("/", async (req, res) => {
  let sql = `
  SELECT
    items.name AS name,
    items.price AS price,
    (SELECT GROUP_CONCAT(item_images.img_url, ',') FROM item_images WHERE item_images.item_id = items.id ORDER BY item_images.id) AS imgURL,
    (SELECT GROUP_CONCAT(item_sizes.size, ',') FROM item_sizes WHERE item_sizes.item_id = items.id ORDER BY item_sizes.id) AS sizes
  FROM items
  LEFT JOIN item_sizes ON items.id = item_sizes.item_id
  GROUP BY items.id;
  `;

  await db.all(sql, [], (err, result) => {
    console.log("client says hi");
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
