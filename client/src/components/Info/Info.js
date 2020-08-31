import React from "react";
import moment from "moment";
import styles from "./Info.module.css";
import InfoDetail from "../InfoDetail/InfoDetail";

function Info(props) {
  let { type, uptime, numCores } = props.infoData;

  return (
    <div className={styles.Info}>
      <InfoDetail header="Operating System" text={type} />
      <InfoDetail
        header="Uptime"
        text={moment.duration(uptime, "seconds").humanize()}
      />
      <InfoDetail header="Number of Cores" text={numCores} />
    </div>
  );
}

export default Info;
