const Democracy = require("democracy");
const EventEmitter = require("events");

class Bully extends EventEmitter {
	constructor(id, peers) {
		super();
		this.id = id;
		this.peers = peers;
		this.alivePeers = [];
		this.leader = null;
		this.electionInProgress = false;
	}

	initDemocracy(port) {
        this.alivePeers = [];
      
        this.democracy = new Democracy({
          source: `0.0.0.0:${port}`,
          peers: this.peers.map(
            (peerId) => `0.0.0.0:${peerId}`
          ),
          id: this.id,
          port: port,
        });
      
        this.democracy.on("added", (peerId) => {
          this.handlePeerRecovery(peerId);
        });
      
        this.democracy.subscribe("election");
        this.democracy.subscribe("ok");
        this.democracy.subscribe("leader");
      
        this.democracy.on("election", (fromId) => {
          this.receiveElectionMessage(fromId);
        });
      
        this.democracy.on("ok", () => {
          this.receiveOkMessage();
        });
      
        this.democracy.on("leader", (leaderId) => {
          this.receiveLeaderMessage(leaderId);
        });
      
        setInterval(() => {
          this.logCurrentLeader();
        }, 1000);
      
        if (!this.leader) {
          this.elect();
        }
      }

	elect() {
		console.log(`[${this.id}] Starting election..`);
		this.electionInProgress = true;
		const higherPeers = this.alivePeers.filter(
			(peerId) => peerId > this.id
		);

		if (higherPeers.length === 0) {
			this.becomeLeader();
		} else {
			higherPeers.forEach((peerId) =>
				this.sendElectionMessage(peerId)
			);
		}
	}

	receiveElectionMessage(fromId) {
        console.log(`[${this.id}] Received election message from ${fromId}`); // Add this line
        console.log("this.id");
		if (this.id > fromId) {
			this.sendOkMessage(fromId);
			if (!this.electionInProgress) {
				this.elect();
			}
		}
	}

	receiveOkMessage() {
		console.log(`[${this.id}] Received OK message`);
		this.electionInProgress = false;
	}

	becomeLeader() {
		this.leader = this.id;
		this.electionInProgress = false;
		this.alivePeers.forEach((peerId) => {
			if (peerId !== this.id) {
				this.sendLeaderMessage(peerId);
			}
		});

		this.emit("becomeLeader");
	}

	receiveLeaderMessage(leaderId) {
        // check if leaderId is in the form of a democracy object
        if (leaderId.id) {
            leaderId = mathleaderId.id;
        }

        this.leader = leaderId;
        this.electionInProgress = false;
    }
    
    

	sendElectionMessage(peerId) {
		this.democracy.publish("election", this.id, {
			target: `0.0.0.0:${peerId}`,
		});
	}

	sendOkMessage(peerId) {
		this.democracy.publish("ok", this.id, {
			target: `0.0.0.0:${peerId}`,
		});
	}

    sendLeaderMessage(peerId) {
        this.democracy.publish("leader", this.id, {
            target: `${peerId}`,
        });
    }

	// Implement methods for handling peer failures and recovery
	handlePeerFailure(peerId) {
        const wasPresent = this.alivePeers.includes(peerId);
        this.alivePeers = this.alivePeers.filter((id) => id !== peerId);
        if (wasPresent) {
          console.log(`[${this.id}] Detected server ${peerId.id} failure`);
          if (this.leader === peerId && !this.electionInProgress) {
            this.elect();
          }
        }
      }

    // function to handle if a server has recovered or if a new server has joined the network
	handlePeerRecovery(peerId) {
        if (!this.alivePeers.includes(peerId)) {
          this.alivePeers.push(peerId);
          console.log(`[${this.id}] Detected server ${peerId} recovery`);
          if (this.leader === null && !this.electionInProgress) {
            this.elect();
          }
        }
      }
      

    logCurrentLeader() {
        if (this.leader) {
            console.log(`[${this.id}] Current leader is: ${this.leader}`);
        } else {
            console.log(`[${this.id}] No current leader`);
        }
    }
}

module.exports = Bully;
