const { EventEmitter } = require("events");
const http = require("http");

class Bully extends EventEmitter {
	constructor(id, peers) {
		super();
		this.id = id;
		this.peers = peers;
		this.leader = null;
		this.alivePeers = {};
		this.isElectionInProgress = false;
		this.syncAlivePeers().then(() => {
			this.startElection();
		});

	}

	updatePeerStatus(peer, isAlive) {
		this.alivePeers[peer] = isAlive;
		if(!isAlive && this.leader === peer) {
			this.startElection();
		}

	}
	
	async startElection() {
		
		this.isElectionInProgress = true;
		const higherPeers = this.peers.filter(
			(peer) => peer > this.id
		);

		if (higherPeers.length === 0) {
			this.becomeLeader();
			return;
		}

		const electionPromises = higherPeers.map((peer) =>
			this.sendElectionMessage(peer)
		);

		try {
			await Promise.any(electionPromises);
		} catch {
			this.becomeLeader();
		}
	}


	async becomeLeader() {
		this.isElectionInProgress = false;
		this.leader = this.id;
		this.emit("elected");
	
		const lowerPeers = this.peers.filter(
			(peer) => peer < this.id
		);
		const acknowledgePromises = lowerPeers.map((peer) =>
			this.acknowledgeLeader(peer)
		);
	
		await Promise.all(acknowledgePromises);
	
		// Inform other instances about the new leader
		this.peers.forEach(async (peer) => {
				try {
					console.log("SUCCESSBUBBY")
					await this.updateLeader(peer);
					this.updatePeerStatus(peer, true);
				} catch (error) {
					console.log("FAILBUBBY")
					this.updatePeerStatus(peer, false);
				}
		});
	}
	
	async updateLeader(peer) {
		return new Promise((resolve, reject) => {
			const requestOptions = {
				method: "GET",
				timeout: 1000,
				hostname: "127.0.0.1",
				port: peer,
				path: `/update-leader/${this.id}`
			};
	
			const req = http.request(requestOptions, (res) => {
				if (res.statusCode === 200) {
					this.updatePeerStatus(peer, true);
					resolve();
				} else {
					reject(new Error(`Non-200 status code: ${res.statusCode}`));
				}
			});
	
			req.on("timeout", () => {
				reject(new Error("Request timed out"));
			});
	
			req.on("error", (err) => {
				if (err.code === 'ECONNREFUSED') {
					this.updatePeerStatus(peer, false);
					reject(err);
				} else {
					this.updatePeerStatus(peer, true);
					console.error("Missed error:", err);
					reject(new Error("Unknown error occurred"));
				}
			});
	
			req.end();
		});
	}
	

	async sendElectionMessage(peer) {
		return new Promise((resolve, reject) => {
			const requestOptions = {
				method: "GET",
				timeout: 1000,
				hostname: "127.0.0.1",
				port: peer,
				path: `/election/${this.id}`
			};
	
			const req = http.request(requestOptions, (res) => {
				if (res.statusCode === 200) {
					this.updatePeerStatus(peer, true);
					resolve();
				} else {
					this.updatePeerStatus(peer, false);
					reject(new Error(`Non-200 status code: ${res.statusCode}`));
				}
			});
	
			req.on("timeout", () => {
				reject(new Error("Request timed out"));
			});
	
			req.on("error", (err) => {
				if (err.code === 'ECONNREFUSED') {
					this.updatePeerStatus(peer, false);
					reject(err);
				} else {
					console.error("Missed error:", err);
					this.updatePeerStatus(peer, true);
					reject(new Error("Unknown error occurred"));
				}
			});
			req.end();
		});
	}
	

	async acknowledgeLeader(leaderId) {
		return new Promise((resolve, reject) => {
			const requestOptions = {
				method: "GET",
				timeout: 1000,
				hostname: "127.0.0.1",
				port: leaderId,
				path: `/leader/${this.id}`
			};
	
			const req = http.request(requestOptions, (res) => {
					if (res.statusCode === 200) {
						this.updatePeerStatus(leaderId, true);
						resolve();
					} else {
						this.updatePeerStatus(leaderId, false);
						reject(new Error(`Non-200 status code: ${res.statusCode}`));
					}
				}
			);
	
			req.on("timeout", () => {
				reject(new Error("Request timed out"));
			});
	
			req.on("error", (err) => {
				if (err.code === 'ECONNREFUSED') {
					this.updatePeerStatus(leaderId, false);
					console.error("Failed to acknowledge leader:", err);
					resolve(); // Resolve the promise to prevent the application from crashing
				} else {
					this.updatePeerStatus(leaderId, true);
					reject(err);
				}
			});
	
			req.end();
		});
	}

	async fetchAlivePeers(peer) {
		return new Promise((resolve, reject) => {
			const requestOptions = {
				method: "GET",
				timeout: 1000,
				hostname: "127.0.0.1",
				port: peer,
				path: "/alive-peers",
			};
	
			const req = http.request(requestOptions, (res) => {
				if (res.statusCode === 200) {
					this.updatePeerStatus(peer, true);
					let data = "";
					res.on("data", (chunk) => {
						data += chunk;
					});
	
					res.on("end", () => {
						const alivePeers = JSON.parse(data);
						resolve(alivePeers);
					});
				} else {
					this.updatePeerStatus(peer, false);
					reject(new Error(`Non-200 status code: ${res.statusCode}`));
				}
			});
	
			req.on("timeout", () => {
				reject(new Error("Request timed out"));
			});
	
			req.on("error", (err) => {
				if (err.code === "ECONNREFUSED") {
					this.updatePeerStatus(peer, false);
					reject(err);
				} else {
					this.updatePeerStatus(peer, true);
					console.error("Missed error:", err);
					reject(new Error("Unknown error occurred"));
				}
			});
	
			req.end();
		});
	}

	async syncAlivePeers() {
		const fetchPeersPromises = this.peers
			.filter((peer) => peer !== this.id)
			.map((peer) => this.fetchAlivePeers(peer));
	
		try {
			const allPeersAliveStatus = await Promise.all(fetchPeersPromises);
			
			allPeersAliveStatus.forEach((peersAliveStatus) => {
				for (const [peer, isAlive] of Object.entries(peersAliveStatus)) {
					this.updatePeerStatus(peer, isAlive);
				}
			});
		} catch (err) {
		}
	}
	
	
}

module.exports = Bully;