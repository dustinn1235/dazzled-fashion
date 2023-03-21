const Democracry = require("democracy");
const { connectDB } = require("./connect");

const setUpSubscribe = (port) => {
  const dem = new Democracry({
    source: `0.0.0.0:${port}`,
    peers: ["0.0.0.0:5000", "0.0.0.0:5001", "0.0.0.0:5002"],
  });

  // switch connection to main db to preserve consistency
  // there is always one server that updating main.
  // Since main is the most updated, every server started will copy main data.
  dem.on("elected", () => connectDB("main"));

  dem.subscribe("global");
  dem.on("global", (msg) => {
    const { db } = require("./connect");
    console.log("Sync");
    new Promise((resolve, reject) => {
      db.run(msg, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    }).catch((err) => console.log(err));
  });
  exports.dem = dem;
};
exports.setUpSubscribe = setUpSubscribe;
