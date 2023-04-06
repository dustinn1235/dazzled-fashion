const express = require("express");
// take port from cmd line
const port = process.argv[2] || "5000";
const cors = require("cors");
require("dotenv").config();
const Bully = require("./bully");

// use for local test connection with frontend. Default does not let frontend fetch from local ip api
const corsOptions = {
	origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Define the list of all possible peers
const allPeers = ["5000", "5001", "5002"];

// Get the index of the current server
const currentIndex = allPeers.indexOf(port);
console.log("bubbby555", currentIndex);
// Remove the current server's index from the peers array
const currentPeers = allPeers
	.slice(0, currentIndex)
	.concat(allPeers.slice(currentIndex + 1));

console.log("bubbby666", currentPeers);

// Create an instance of the Bully class with the current server's ID and its peers
const bully = new Bully(port, currentPeers);

// Initialize Democracy for Bully instance
bully.initDemocracy(port);
console.log(`[${port}] current leader when starting: ${bully.leader}`);

bully.on("becomeLeader", () => {
	console.log(`Server on port ${port} is now the leader`);
});

// set up communication
const { setUpSubscribe } = require("./communicate");
setUpSubscribe(port, bully);

app.get("/health-check", (req, res) => {
	res.status(200).send("OK");
});

app.use("/api/items", require("./routes/itemsRoute"));
app.use("/api/addOrder", require("./routes/ordersRoute"));
app.use("/api/qty", require("./routes/qtyRoute"));

app.listen(port, (err) => {
	if (err) {
		console.log("Failed to listen on PORT " + port);
	} else {
		console.log("Application Server listening on PORT " + port);

		// Add a delay before starting the leader election process
      // Start the leader election process
      bully.elect();
	}
});
