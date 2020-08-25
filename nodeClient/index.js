let os = require("os");
let cpus = os.cpus();

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
