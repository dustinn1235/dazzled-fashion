const Democracry = require("democracy");
const port = require("./server");
const db = require("./connect");

const setUpSubscribe = (port) => {
  const dem = new Democracry({
    source: `0.0.0.0:${port}`,
    peers: ["0.0.0.0:5000", "0.0.0.0:5001", "0.0.0.0:5002"],
  });

  dem.subscribe("global");
    dem.on("global", (msg) => {
      console.log("Sync");
      new Promise((resolve, reject) => {
        db.run(msg, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }).catch((err) => console.log(err));
  });
  // dem.on("global", (msg) => {
  //   console.log(msg);
  // });
  exports.dem = dem;
};
exports.setUpSubscribe = setUpSubscribe;
