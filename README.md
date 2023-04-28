# DazzleD - Distributed Fashion E-commerce System

## Project snapshots
<table>
  <tr>
    <td>
      <img src="https://user-images.githubusercontent.com/60798675/235094114-abc6b019-e273-42a2-87f0-fc8b0ddf18ac.png" width="100%">
    </td>
  </tr>
  <tr>
    <td>
       <img src="https://user-images.githubusercontent.com/60798675/235096515-7fd9037e-f0a8-4c1d-954b-24b350d646e1.png" width="100%">
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://user-images.githubusercontent.com/60798675/235093430-522ee206-dbd7-4118-9981-10c1eae9e920.png" width="49%" height=auto>
      <img src="https://user-images.githubusercontent.com/60798675/235093944-58e4c71f-2fd8-492c-8793-dd008be07062.png" width="49%" height=870>
    </td>
  </tr>
  <tr>
    <td>
       <img src="https://user-images.githubusercontent.com/60798675/235096886-2cbda11d-ca3b-4d65-9320-299675e0f606.png" width="100%">
    </td>
  </tr>
  <tr>
    <td>
       <img src="https://user-images.githubusercontent.com/60798675/235097018-e81815cc-fac2-4a1d-b9fe-251f9de0cc06.png" width="100%">
    </td>
  </tr>
</table>

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
