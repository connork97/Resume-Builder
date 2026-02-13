import React, { useState } from "react";
import styles from "./Zoom.module.css";

function Zoom({ zoom, setZoom }) {
  const [open, setOpen] = useState(false);

  const zoomOptions = [0.25, 0.5, 0.75, 0.9, 1, 1.25, 1.5];

  const handleSelect = (value) => {
    setZoom(value);
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.display}
        onClick={() => setOpen((o) => !o)}
      >
        {Math.round(zoom * 100)}%
        <span className={styles.arrow}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {zoomOptions.map((value) => (
            <div
              key={value}
              className={styles.option}
              onClick={() => handleSelect(value)}
            >
              {Math.round(value * 100)}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Zoom;