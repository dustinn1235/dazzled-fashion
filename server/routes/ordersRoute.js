const express = require("express");
const router = express.Router();
const db = require("../connect");

// get all items
router.post("/", async (req, res) => {
  // TODO add data validation
  // TODO create order table and add the following order to the database
  if (!req) res.status(418).send({ message: "Invalid data!" });
  console.log(req.body);

  const items = req.body.items;
  console.log("items", items);

  for (const item of items) {
    const name = item.name;
    const size = item.size;
    const qty = item.qty;

    let update = `
      UPDATE item_sizes
      JOIN items ON item_sizes.item_id = items.id
      SET item_sizes.qty = (item_sizes.qty - ${qty})
      WHERE items.name = "${name}" AND item_sizes.size = "${size}";`;

    await db.query(update, (err, result) => {
      if (err) throw err;
    });

  }  

  res.send(req.body);
});

module.exports = router;
