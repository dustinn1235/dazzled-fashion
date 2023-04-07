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

	// Set up an interval to check the leader's status
	setInterval(() => {
		if (bully.leader === null || bully.state === "ELECTION") {
			bully.startElection();
		}
	}, 1000);

	// init connect
	let curConnection = `./db/rep${bully.id}.db`;
	connectDB(port, `./db/rep${bully.id.slice(-1)}.db`);

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

	setInterval(() => {
		bully.syncAlivePeers();
		console.log(
			`Current leader: ${
				bully.leader ? bully.leader : "unknown"
			}`,
			"\nalive peers:", bully.alivePeers
			,"\nstate:", bully
			);
	}, 1000);

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
};

exports.setUpSubscribe = setUpSubscribe;
