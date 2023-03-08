const express = require("express");
const port = process.env.PORT || 5001;
const cors = require("cors");
const rdb = require("./replicatedconnect");
require("dotenv").config();

// use for local test connection with frontend. Default does not let frontend fetch from local ip api
const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());


app.listen(port, () => console.log("Server Started"));


