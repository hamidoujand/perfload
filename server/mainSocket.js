let mongoose = require("mongoose");
let Machine = require("./models/Machine");
mongoose
  .connect("mongodb://127.0.0.1:27017/perfLoad", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB in the House!"));

module.exports = (io, socket) => {
  let macAddress;
  socket.on("clientAuth", async (key) => {
    // we need a way to find out which is NodeClient and which is React Client later
    if (key === "nodeClient") {
      //here we add them to a room for clients
      socket.join("clients");
    } else if (key === "uiClient") {
      socket.join("uiClient");
      console.log("Client React just Connected");
      //here send list of all machines that have been connected
    } else {
      //an invalid client is here we need to disconnect it
      socket.disconnect(true);
    }
  });

  //send data to React Client
  socket.on("perfData", (perfDate) => {
    io.to("uiClient").emit("data", perfDate);
  });

  socket.on("initPerfData", async (data) => {
    macAddress = data.macAddress;
    let machine = await checkOrAddMachine(data);
  });
};

async function checkOrAddMachine(data) {
  let machine = await Machine.findOne({
    macAddress: data.macAddress,
  });
  if (machine) {
    return machine;
  } else {
    let newMachine = await Machine.create({
      ...data,
    });
    return newMachine;
  }
}
