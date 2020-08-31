import React from "react";
import styles from "./Info.module.css";

function InfoDetail(props) {
  return (
    <div className={styles.InfoWrapper}>
      <h4>{props.header}</h4>
      <p>{props.text}</p>
    </div>
  );
}

export default InfoDetail;
