const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// use for local test connection with frontend. Default does not let frontend fetch from local ip api
const corsOptions = {
  origin: "http://127.0.0.1:5173",
};

const app = express();
app.use(cors(corsOptions));

app.use("/api/items", require("./routes/itemsRoute"));

app.listen(port, () => console.log("Server Started"));
