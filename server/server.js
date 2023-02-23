const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const items = require("./data/mockdata.json");

const corsOptions = {
  origin: "http://127.0.0.1:5173",
};

const app = express();
app.use(cors(corsOptions));

app.get("/api/items", (req, res) => {
  res.status(200).json(items);
});

app.listen(port, () => console.log());
