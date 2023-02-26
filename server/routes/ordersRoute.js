const express = require("express");
const router = express.Router();
const db = require("../connect");

const validateData = (req) => {
  let total = 0;
  // Check userName, subTotal, and date data types.
  if (
    !req.body ||
    !req.body.userName ||
    typeof req.body.userName !== "string" ||
    !req.body.subTotal ||
    typeof req.body.subTotal !== "number" ||
    req.body.subTotal < 0 ||
    !req.body.date ||
    typeof req.body.date !== "string" ||
    !req.body.items
  ) {
    return false;
  }
  // Check items in the cart
  for (let i = 0; i < req.body.items.length; i++) {
    if (
      !req.body.items[i].name ||
      !req.body.items[i].price ||
      !req.body.items[i].qty ||
      !req.body.items[i].size ||
      typeof req.body.items[i].name !== "string" ||
      typeof req.body.items[i].size !== "string" ||
      typeof req.body.items[i].qty !== "number" ||
      typeof req.body.items[i].price !== "number" ||
      req.body.items[i].qty < 0 ||
      req.body.items[i].price < 0
    ) {
      return false;
    }
    let itemTotal = req.body.items[i].qty * req.body.items[i].price;
    total += itemTotal;
  }

  // If total of items in the cart not equal to subtotal, invalid request.
  if (total !== req.body.subTotal) return false;
  return true;
};

// get all items
router.post("/", validateData, async (req, res) => {
  // TODO add data validation
  if (!validateData(req)) res.status(418).send({ message: "Invalid data!" });
  // TODO create order table and add the following order to the database
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
