const Democracry = require("democracy");
const { connectDB } = require("./connect");

let logicalTime = 0;

// Increment logical clock
function incrementClock() {
  logicalTime++;
  return logicalTime;
}

// When new update arrives, update the clock based on the logical time from message and current
function updateClock (timestamp) {
  logicalTime = Math.max(logicalTime, timestamp) + 1;
  return logicalTime;
}

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

  // Adding a listener for the 'added' event, which is emitted when a new server is added to the network
  // If this server is the leader, do nothing. If there is no leader, copy from the baseline db.
  // If this server is not the leader, clone from the appropriate leader db
  dem.on("added", () => {
    const leader = dem.leader();
    if (leader !== null && leader.id !== dem._id)
      if (curConnection !== `./db/rep${leader.id}.db`) {
        connectDB(port, `./db/rep${leader.id}.db`);
        curConnection = `./db/rep${leader.id}.db`;
      }
  });

  // Adding a listener for the 'elected' event, which is emitted when this server is elected as the leader
  // This will print a message to indicate that this server is the leader
  dem.on("elected", () => console.log("I am the captain!"));

  dem.subscribe("global");
  // Adding a listener for the 'global' event, which is emitted when a message is received on the global channel
  // The message contains a SQL query to be executed on the database


  dem.on("global", (msg) => {
    const { db } = require("./connect");

    console.log("pp" + msg);

    // split timestamp and query m
    const[timestamp,update] = msg.split("|");
    // console.log(timestamp.toString());

    console.log("Sync");
    new Promise((resolve, reject) => {
      db.run(update, (err, result) => {
        if (err) reject(err);
        resolve(result);

        // Increment logical clock on successful query 
        updateClock(timestamp);
        console.log("Logical Time is: " + logicalTime);
      });
    }).catch((err) => console.log(err));
  });
  exports.dem = dem;
};
exports.setUpSubscribe = setUpSubscribe;
exports.logicalTime = logicalTime;
exports.incrementClock = incrementClock;
exports.updateClock = updateClock;