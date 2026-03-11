import React, { useState } from 'react';
import styles from "./RichTextToolbar.module.css";

const FONT_COLORS = [
  // Column 1
  "#000000", "#FF4444", "#FFA000", "#FFFF33", "#00FF88", "#0055FF", "#FF33FF",

  // Column 2
  "#3A3A3A", "#CC3333", "#CC8000", "#CCCC00", "#00CC66", "#0044CC", "#CC00CC",

  // Column 3
  "#777777", "#992222", "#996000", "#999900", "#009944", "#003399", "#990099",

  // Column 4
  "#B5B5B5", "#661111", "#664000", "#666600", "#006622", "#002266", "#660066",

  // Column 5
  "#FFFFFF", "#330000", "#332000", "#333300", "#003300", "#001133", "#330033"
];

const ToolbarDropdown = ({ styling, currentEditorFontColor, handleSetFontColor }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.toolbarDropdownContainer}>
      <button
        className={styles.toolbarDropdownButton}
        style={styling}
        onClick={() => setOpen(o => !o)}
      >
        A
      </button>

      {open && (
        <div className={styles.dropdownPanel}>
          {FONT_COLORS.map((color, index) => (
            <div
              key={index}
              className={styles.colorSwatch}
              style={{ backgroundColor: color }}
              onClick={() => {
                handleSetFontColor(color);
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
