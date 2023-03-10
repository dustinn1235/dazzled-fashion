const Democracry = require("democracy");
const port = require("./server");

const setUpSubscribe = (port) => {
  const dem = new Democracry({
    source: `0.0.0.0:${port}`,
    peers: ["0.0.0.0:5000", "0.0.0.0:5001"],
  });

  dem.subscribe("global");
  dem.on("global", (msg) => {
    console.log(msg);
  });
  exports.dem = dem;
};
exports.setUpSubscribe = setUpSubscribe;
