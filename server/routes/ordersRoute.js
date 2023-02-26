const express = require("express");
const router = express.Router();
const db = require("../connect");

const validateData = (req, res, next) => {
  const { value } = req.body;
  if (!value ||
    !value.imgURL ||
    !Array.isArray(value.imgURL) ||
    value.imgURL.length !== 3 ||

    !value.name ||
    typeof value.name !== "string" ||

    !value.price ||
    typeof value.price !== "number" ||
    value.price > 0 ||

    !value.qty ||
    typeof value.qty !== "number" ||
    value.qty > 0 ||

    !value.size ||
    typeof value.size !== "string" ||
    value.size.length !== 1 ||

    !value.sizes ||
    !Array.isArray(value.sizes) ||
    !value.sizes.every((s) => typeof s === "string")
  ) {
    return res.status(400).json({ message: "Invalid data" });
  }
  next();
};

// get all items
router.post("/",validateData, async (req, res) => {
  // TODO add data validation
  // TODO create order table and add the following order to the database
  // if (!req) res.status(418).send({ message: "Invalid data!" });
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
