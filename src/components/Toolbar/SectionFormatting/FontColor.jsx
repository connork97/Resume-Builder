import React, { useState } from "react";
import styles from "./FontColor.module.css";

const COLORS = [
  { name: "Red", value: "#ff0000" },
  { name: "Orange", value: "#ff7f00" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Green", value: "#00cc00" },
  { name: "Blue", value: "#0066ff" },
  { name: "Purple", value: "#8000ff" },
  { name: "Pink", value: "#ff66cc" },
  { name: "Brown", value: "#8b4513" },
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#333333" },
  { name: "Gray", value: "#777777" },
  { name: "Light Gray", value: "#cccccc" },
  { name: "White", value: "#ffffff" }
];

export default function FontColor({ formatting }) {
  const [open, setOpen] = useState(false);
  const { activeFormats, saveSelection, restoreSelection } = formatting;

  const applyColor = (color) => {
    restoreSelection();
    document.execCommand("foreColor", false, color);
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.display}
        onMouseDown={saveSelection}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={styles.currentFontColor}
          style={{color: activeFormats.fontColor}}
          // className={styles.currentSwatch}
          // style={{ backgroundColor: activeFormats.fontColor }}
        >A</span>
        <span className={styles.arrow}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {COLORS.map((c) => (
            <div
              key={c.value}
              className={styles.option}
              onMouseDown={saveSelection}
              onClick={() => applyColor(c.value)}
            >
              <span
                className={styles.swatch}
                style={{ backgroundColor: c.value }}
              />
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}