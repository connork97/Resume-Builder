import React from "react";
import styles from "./Paper.module.css";

function Paper({ children, scale = 1, fontSize, fontColor }) {
  // 100% zoom = 90vh
  const scaledHeight = 90 * scale; // vh units

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.paper}
        style={{ height: `${scaledHeight}vh` }}
      >
     <div 
          className={styles.contentWrapper}
          style={{
               fontSize: `${fontSize}px`,
               color: fontColor
          }}
     >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Paper;