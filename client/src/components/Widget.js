import React from "react";

import Cpu from "./Cpu";
import Memory from "./Mem";
import Info from "./Info";

function Widget(props) {
  let {
    freeMem,
    totalMem,
    type,
    memUsage,
    cpuModel,
    cpuSpeed,
    numCores,
    uptime,
    cpuLoad,
  } = props.data;
  return (
    <div>
      <h2>Widget</h2>
      <p>{cpuLoad}</p>
      <Cpu />
      <Memory />
      <Info />
    </div>
  );
}

export default Widget;
