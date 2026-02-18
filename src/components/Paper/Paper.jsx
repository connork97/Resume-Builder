import React, { useState } from "react";
import styles from "./Paper.module.css";

export default function Paper({ children, zoom }) {

  
  const findMarginBottom = () => {
    const defaultMarginBottom = 85;
    const extraMarginBottom = defaultMarginBottom * (zoom - 1);
    return `${4 + extraMarginBottom}vh`
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.paper}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          marginBottom: findMarginBottom()
        }}
      >
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}