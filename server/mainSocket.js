module.exports = (io, socket) => {
  socket.on("clientAuth", (key) => {
    // we need a way to find out which is NodeClient and which is React Client later
    if (key === "werewolf") {
      //here we add them to a room for clients
      socket.join("clients");
    } else if (key === "onlyWolf") {
      socket.join("ui");
    } else {
      //an invalid client is here we need to disconnect it
      socket.disconnect(true);
    }
  });

  socket.on("perfData", (perfDate) => {
    console.log(perfDate);
  });
};
