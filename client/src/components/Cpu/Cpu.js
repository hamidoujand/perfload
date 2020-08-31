import React, { useEffect, useRef } from "react";
import drawCircle from "../../canvas/loadAnimation";
import styles from "./Cpu.module.css";

function Cpu(props) {
  let canvasDiv = useRef(null);
  let { cpuLoad } = props.cpuData;
  useEffect(() => {
    drawCircle(canvasDiv.current, cpuLoad);
  }, [cpuLoad]);
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>CPU Load</h2>
      <div className={styles.CanvasWrapper}>
        <canvas
          className={styles.CpuCanvas}
          width={200}
          height={200}
          ref={canvasDiv}
        ></canvas>
        <div className={styles.CpuText}>{cpuLoad}%</div>
      </div>
    </div>
  );
}

export default Cpu;
