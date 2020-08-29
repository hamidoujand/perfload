let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let machineSchema = new Schema({
  macAddress: String,
  cpuLoad: Number,
  freeMem: Number,
  totalMem: Number,
  memUsage: Number,
  osType: Number,
  uptime: Number,
  cpuModel: String,
  numCores: Number,
  cpuSpeed: Number,
});

module.exports = mongoose.model("Machine", machineSchema);
