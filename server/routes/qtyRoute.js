const express = require("express");
const router = express.Router();
const db = require("../connect");

// get all qty for all sizes of an item
router.get("/:name", async (req, res) => {
  const { name } = req.params;
  let sql = `
    SELECT item_sizes.size, item_sizes.qty
    FROM item_sizes
    JOIN items ON item_sizes.item_id = items.id
    WHERE items.name = "${name}";`;

  await db.all(sql, (err, result) => {
    if (err) throw err;
    else {
      const data = {};
      for (const e of result) {
        data[e.size] = e.qty;
      }
      res.status(200).json(data);
    }
  });
});

module.exports = router;
