const Democracy = require("democracy");
const { connectDB } = require("./connect");

// A function used to set up a subscription to the global channel using the Democracy module
const setUpSubscribe = (port, bullyInstance) => {
	const dem = new Democracy({
		source: `0.0.0.0:${port}`,
		peers: ["0.0.0.0:5000", "0.0.0.0:5001", "0.0.0.0:5002"],
		id: `${port.slice(-1)}`,
	});

  console.log("Bubby1 from port: ", port);

	// init connect
	let curConnection = `./db/rep${dem._id}.db`;
	connectDB(port, `./db/rep${dem._id}.db`);

	dem.on("added", (peer) => {
		const peerId = peer.id; // Extract the peerId from the peer address
		bullyInstance.handlePeerRecovery(peerId);
		const leader = bullyInstance.leader;
    console.log("BUBBBBBBBBBBBBBBBBBBBBY: ", bullyInstance.leader)
		if (leader !== null && leader !== dem._id) {
			if (curConnection !== `./db/rep${leader}.db`) {
				connectDB(port, `./db/rep${leader}.db`);
				curConnection = `./db/rep${leader}.db`;
			}
		}
		bullyInstance.handlePeerRecovery(dem._id);
	});

	dem.on("disconnect", (peerId) => {
		// Trigger the election process when a peer is disconnected
		exports.bully.handlePeerFailure(peerId);
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
