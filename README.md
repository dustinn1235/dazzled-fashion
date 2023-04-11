# Group 23 Final Project - Dazzled

## How to set up your environment

1. Make sure you have the latest version of Node.js installed.
2. unzip the project folder and open it in your favorite IDE. We recommend VSCode.
3. Navigate to the project folder in your terminal
4. To install the client side dependencies cd into the client folder and run `npm install`
5. To install the server side dependencies cd into the server folder and run `npm install`

## How to run the system

1. Open three terminals (minimum) and navigate to the project folder in each one.
2. In the first terminal, cd into the client folder and run `npm run dev` to start the client side.
3. In the second terminal, cd into the server folder and run `node loadbalancer 4000` to start the load balancer on port 4000.
4. In the third terminal, cd into the server folder and run `node reset` to initialize the server databases with the default data.
5. In the third terminal, run `node server 5000` to start the server on port 4001.
6. Go to your web browser and navigate to `localhost:5173` to view the client side.

## FYI

- You can run any combination of up to 2 load balancers and 3 servers on your local machine. Just make sure to open a new terminal, cd into the server folder, and run `node server <port>` for each server you want to run. For the load balancer, run `node loadbalancer <port>` for each load balancer you want to run.
- Current load balancer ports are 4000 and 4001.
- Current server ports are 5000, 5001, and 5002.
- You can also open another terminal, cd to the client folder, and run `npm run dev` to run a secondary instance of the client side on your local machine. In this case, navigate to `localhost:5174` to view the secondary client.
