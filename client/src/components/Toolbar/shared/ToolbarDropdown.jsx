import React, { useState } from 'react';
import styles from "./SharedToolbar.module.css";

const COLORS = [
  // Column 1
  "rgba(0, 0, 0, 1)",       "rgba(255, 68, 68, 1)",     "rgba(255, 160, 0, 1)",
  "rgba(255, 255, 51, 1)",  "rgba(0, 255, 136, 1)",     "rgba(0, 85, 255, 1)",
  "rgba(255, 51, 255, 1)",

  // Column 2
  "rgba(58, 58, 58, 1)",    "rgba(204, 51, 51, 1)",     "rgba(204, 128, 0, 1)",
  "rgba(204, 204, 0, 1)",   "rgba(0, 204, 102, 1)",     "rgba(0, 68, 204, 1)",
  "rgba(204, 0, 204, 1)",

  // Column 3
  "rgba(119, 119, 119, 1)", "rgba(153, 34, 34, 1)",     "rgba(153, 96, 0, 1)",
  "rgba(153, 153, 0, 1)",   "rgba(0, 153, 68, 1)",      "rgba(0, 51, 153, 1)",
  "rgba(153, 0, 153, 1)",

  // Column 4
  "rgba(181, 181, 181, 1)", "rgba(102, 17, 17, 1)",     "rgba(102, 64, 0, 1)",
  "rgba(102, 102, 0, 1)",   "rgba(0, 102, 34, 1)",      "rgba(0, 34, 102, 1)",
  "rgba(102, 0, 102, 1)",

  // Column 5
  "rgba(255, 255, 255, 1)", "rgba(51, 0, 0, 1)",        "rgba(51, 32, 0, 1)",
  "rgba(51, 51, 0, 1)",     "rgba(0, 51, 0, 1)",        "rgba(0, 17, 51, 1)",
  "rgba(51, 0, 51, 1)"
];


const ToolbarDropdown = ({ text, styling, handleSetColor }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.toolbarDropdownContainer}>
      <button
        className={styles.toolbarDropdownButton}
        style={styling}
        onClick={() => setOpen(o => !o)}
      >
        {text}
      </button>

      {open && (
        <div className={styles.dropdownPanel}>
          {COLORS.map((color, index) => (
            <div
              key={index}
              className={styles.colorSwatch}
              style={{ backgroundColor: color }}
              onClick={() => {
                handleSetColor(color);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolbarDropdown;
