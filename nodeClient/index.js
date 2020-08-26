let os = require("os");
let cpus = os.cpus();
let io = require("socket.io-client");
let socket = io("http://127.0.0.1:8000");
socket.on("connect", function () {
  //here we need a unique id for each machine and the best thing is the MAC address so we use the os.interfaces to get a MAC addr
  //and we need to find one that is not internal (internal:false)
  let networkInterfaces = os.networkInterfaces();
  let macAddress;
  for (let interface in networkInterfaces) {
    networkInterfaces[interface].forEach((NI) => {
      if (!NI.internal) {
        macAddress = NI.mac;
        return;
      }
    });
  }
  //we also want to emit an auth event because we need a way to find out which is NodeClient and which is React Client later
  socket.emit("clientAuth", "werewolf");

  let perfDataInterval = setInterval(async () => {
    let data = await performanceData();
    data["macAddress"] = macAddress;
    //each second we emit to server the realtime data
    socket.emit("perfData", data);
  }, 1000);

  //if the socket gets disconnect we need to remove the listeners otherwise its going to have multiple events emit to our server each time the socket is restart
  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});
async function performanceData() {
  return new Promise(async (resolve, reject) => {
    //type of os
    let type =
      os.type() === "Darwin"
        ? "Mac"
        : os.type() === "Windows_NT"
        ? "Windows"
        : os.type();

    let uptime = os.uptime(); //seconds

    let freeMem = os.freemem(); //bytes
    let totalMem = os.totalmem();
    let memUsage = Math.floor(((totalMem - freeMem) / totalMem) * 100);
    let cpuModel = cpus[0].model;
    let cpuSpeed = cpus[0].speed;
    let numCores = cpus.length;

    let cpuLoad = await getCpuLoad();
    //we pass all data
    resolve({
      freeMem,
      totalMem,
      type,
      memUsage,
      cpuModel,
      cpuSpeed,
      numCores,
      uptime,
      cpuLoad,
    });
  });
}

//cpuLoad is a little bit tricky we need to loop the cpus and then average all the  cpu in each mode and do this for all cores

function cpuAverage() {
  let cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach((core) => {
    for (let type in core.times) {
      totalMs += core.times[type]; //all times
    }
    //lets get the idle time also
    idleMs += core.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

//we need another fn to call cpuAverage  100ms later
function getCpuLoad() {
  return new Promise((resolve, reject) => {
    let start = cpuAverage();
    setTimeout(() => {
      let end = cpuAverage();
      let idleDiff = end.idle - start.idle;
      let totalDiff = end.total - start.total;
      let percentageCpu = 100 - Math.floor((idleDiff / totalDiff) * 100);
      resolve(percentageCpu);
    }, 100);
  });
}
