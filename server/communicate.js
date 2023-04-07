// const Democracry = require("democracy");
const { connectDB } = require("./connect");
const Bully = require("./bully");

// A function used to set up a subscription to the global channel using the Democracy module
const setUpSubscribe = (app, port) => {
	// Create a Bully instance for this server
	const bully = new Bully(port, ["5000", "5001", "5002"]);

	app.get("/alive-peers", (req, res) => {
		res.status(200).json(bully.alivePeers);
	});	

	app.get("/update-leader/:leaderId", (req, res) => {
		const leaderId = req.params.leaderId;
		bully.leader = leaderId;
		res.status(200).send();
	});	

	app.get("/election/:senderId", (req, res) => {
		const senderId = req.params.senderId;

		if (bully.id < senderId && !bully.isElectionInProgress) {
			bully.startElection();
		}

		res.status(200).send();
	});

	app.get("/leader/:leaderId", (req, res) => {
		const leaderId = req.params.leaderId;

		if (bully.id < leaderId) {
			bully.emit("leader", leaderId);
			bully.leader = leaderId;
		}

		res.status(200).send();
	});

	app.get("/current-leader", (req, res) => {
		res.status(200).send(bully.leader ? bully.leader : "unknown");
	});
	

	// Set up an interval to check the leader's status
	setInterval(() => {
		bully.syncAlivePeers();
		if (bully.leader === null || bully.isElectionInProgress) {
			bully.startElection();
		}
		console.log("Current Leader is: ", bully.leader);
	}, 1000);

	// init connect

	// get leader database
	const waitForLeaderAndSync = (bully, port) => {
		if (bully.leader !== null) {
		  const leaderId = bully.leader.slice(-1);
		  const leaderDB = `./db/rep${leaderId}.db`;
		  connectDB(port, leaderDB);
		} else {
		  setTimeout(() => waitForLeaderAndSync(bully, port), 500);
		}
	  };

	  waitForLeaderAndSync(bully, port);
	  

	// Adding a listener for the 'elected' event, which is emitted when this server is elected as the leader
	// This will print a message to indicate that this server is the leader
	bully.on("elected", () => {
		console.log(`I (${bully.id}) am the captain!`);
	});

	bully.on("leader", (leaderId) => {
		console.log(
			`I (${bully.id}) acknowledge ${leaderId} as the captain!`
		);
		bully.leader = leaderId;
	});

	// Adding a listener for the 'message' event, which is emitted when a message is received from the leader
	bully.on("message", (msg) => {
		const { db } = require("./connect");
		console.log("Sync");
		new Promise((resolve, reject) => {
			db.run(msg, (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		}).catch((err) => console.log(err));
	});
	exports.bully = bully;
};

exports.setUpSubscribe = setUpSubscribe;
