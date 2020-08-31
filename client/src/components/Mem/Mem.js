import React, { useEffect, useRef } from "react";
import drawCircle from "../../canvas/loadAnimation";

import styles from "./Mem.module.css";

const GIG = 1073741824;

function Mem(props) {
  let { freeMem, totalMem, memUsage } = props.memData;
  let canvasDiv = useRef(null);
  useEffect(() => {
    drawCircle(canvasDiv.current, memUsage);
  }, [memUsage]);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Memory Usage</h2>
      <div className={styles.canvasWrapper}>
        <canvas width={200} height={200} ref={canvasDiv}></canvas>
        <div className={styles.MemText}>{memUsage}%</div>
      </div>
      <div className={styles.Detail}>
        <h4>Total Memory : {Math.floor(totalMem / GIG)}</h4>
        <h4>Free Memory : {Math.floor(freeMem / GIG)}</h4>
      </div>
    </div>
  );
}

export default Mem;
