let express = require("express");
let cluster = require("cluster");
let net = require("net");
let socketio = require("socket.io");
let numProcesses = require("os").cpus().length;
let ioRedis = require("socket.io-redis");
let farmHahs = require("farmhash");
let SocketIoRedis = require("socket.io-redis");

let mainSocketHandler = require("./mainSocket");

//we need an array to keep track of all the workers

if (cluster.isMaster) {
  let workers = [];

  function spawn(i) {
    workers[i] = cluster.fork();
    //if worker is dead we need to simply spawn another one
    workers[i].on("exit", (code, signal) => {
      spawn(i); //we create another one
    });
  }

  //here we loop for each process and spawn a node app
  for (let i = 0; i < numProcesses; i++) {
    spawn(i);
  }
  //we need a hash algorithm to convert the ip address to an index to be we use farmHash
  function workerIndex(ip, lenOfArr) {
    return farmHahs.fingerprint32(ip) % lenOfArr;
  }

  //we need an independent tcp port so we use Net module to create that
  //and we use the Express to to handle
  let server = net.createServer({ pauseOnConnect: true }, (connection) => {
    //here we here are going to grab a worker and hand that worker to handle this connection
    let index = workerIndex(connection.remoteAddress, numProcesses);

    let worker = workers[index];
    //here we send the sticky session and the connection and this part make sure the connection and worker always find each other
    worker.send("sticky-session:connection", connection);
  });
  server.listen(8000);
} else {
  let app = express();
  //we are going to listen to port 0 because we  do not expose our express server this only for getting io to work
  //Because the Master is listening for us we do not need to do that
  let server = app.listen(0, "0.0.0.0");
  let io = socketio(server);
  //we need to make the socket to work with redis adapter
  io.adapter(SocketIoRedis({ host: "localhost", port: 6379 }));
  //NOTE : default adaptor is instance of Adapter which is socket io ships with here we want to use redis

  //and we handle all of the stuff with this fn
  io.on("connection", (socket) => {
    mainSocketHandler(io, socket);
  });

  //and we only are going to listen for messages that comes from the worker that are about sticky-session
  process.on("message", (message, connection) => {
    if (message !== "sticky-session:connection") {
      return;
    }
    //otherwise we emit the connection
    server.emit("connection", connection);
    connection.resume();
  });
}
