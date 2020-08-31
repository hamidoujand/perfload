import React from "react";

import styles from "./Widget.module.css";

import Cpu from "../Cpu/Cpu";
import Mem from "../Mem/Mem";
import Info from "../Info/Info";

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
    macAddress,
  } = props.data;
  let cpu = { cpuLoad };
  let mem = { freeMem, totalMem, memUsage };
  let info = { macAddress, type, uptime, numCores, cpuSpeed, cpuModel };

  return (
    <div className={styles.Widget}>
      <div className={styles.Wrapper}>
        <Cpu cpuData={cpu} />
        <Mem memData={mem} />
        <Info infoData={info} />
      </div>
    </div>
  );
}

export default Widget;
