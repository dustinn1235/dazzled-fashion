const express = require("express");
const router = express.Router();
const db = require("../connect");

// get all items
router.post("/", async (req, res) => {
  // TODO add data validation
  // TODO create order table and add the following order to the database
  if (!req) res.status(418).send({ message: "Invalid data!" });
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
