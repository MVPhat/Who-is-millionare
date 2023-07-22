import React from "react";
import styles from "./styles.module.scss";

const Dot = ({ type, color = "#9880ff" }) => {
  return (
    <div
      className={styles[`dot-${type}`]}
      style={{ color, backgroundColor: color }}
    ></div>
  );
};

export default Dot;
