const Democracry = require("democracy");
const { connectDB } = require("./connect");

// A function used to set up a subscription to the global channel using the Democracy module
const setUpSubscribe = (port) => {
  const dem = new Democracry({
    source: `0.0.0.0:${port}`,
    peers: ["0.0.0.0:5000", "0.0.0.0:5001", "0.0.0.0:5002"],
    id: `${port.slice(-1)}`,
  });

  // init connect
  let curConnection = `./db/rep${dem._id}.db`;
  connectDB(port, `./db/rep${dem._id}.db`);

  // keep track of active servers
  const activeServers = new Set();

  // Adding a listener for the 'added' event, which is emitted when a new server is added to the network
  // updating the activeServers list when new server start
  dem.on("added", (data) => {
    activeServers.add(data.id);
    console.log([...activeServers][0]);
    firstAvailServer = [...activeServers][0];
    if (curConnection !== `./db/rep${firstAvailServer}.db`) {
      connectDB(port, `./db/rep${firstAvailServer}.db`);
      curConnection = `./db/rep${firstAvailServer}.db`;
    }
  });

  // updating the activeServers list when a server is down
  dem.on("removed", (data) => {
    activeServers.delete(data.id);
  });

  dem.subscribe("global");
  // Adding a listener for the 'global' event, which is emitted when a message is received on the global channel
  // The message contains a SQL query to be executed on the database
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
