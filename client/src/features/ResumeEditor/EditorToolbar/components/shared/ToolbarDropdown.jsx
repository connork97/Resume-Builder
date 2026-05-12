import React, { useState } from 'react';

import { selectUsedResumeColors } from '@/utils/resumeColorSelectors';

import styles from "./SharedToolbar.module.css";
import { useSelector } from 'react-redux';

import { BASE_COLORS } from '@/lib/baseColors';

const ToolbarDropdown = ({ text, styling, handleSetColor }) => {

  const usedColors = useSelector(selectUsedResumeColors);
  // const colors = [
  // ...BASE_COLORS,
  // ...usedColors
  // ]

  const [open, setOpen] = useState(false);

  const handleCustomColor = (event) => {
    const hex = event.target.value;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    handleSetColor(`rgba(${r}, ${g}, ${b}, 1)`);
    setOpen(false);
  };

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
          {BASE_COLORS.map((color, index) => (
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
          <span className={styles.customColorButton}>Colors In Use</span>
            {usedColors.map((color, index) => (
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

          <label className={styles.customColorButton}>
            Custom
            <input
              type="color"
              className={styles.hiddenColorInput}
              onChange={handleCustomColor}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ToolbarDropdown;