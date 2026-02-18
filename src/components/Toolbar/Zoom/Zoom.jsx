import React from "react";
import styles from "./Zoom.module.css";

export default function Zoom({ zoom, setZoom }) {
  const options = [0.25, 0.5, 0.75, 0.9, 1, 1.25, 1.5];

  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {Math.round(value * 100)}%
          </option>
        ))}
      </select>
    </div>
  );
}