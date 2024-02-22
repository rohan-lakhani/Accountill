import React from "react";
import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div
      className={`${styles.container} flex items-center justify-center flex-col`}
      style={{ height: "calc(100vh - 55px)" }}
    >
      <div className={styles.loader}></div>
    </div>
  );
};

export default Spinner;
