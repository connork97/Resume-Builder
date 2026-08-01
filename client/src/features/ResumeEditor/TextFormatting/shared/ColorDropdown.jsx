import React, { useState, useCallback } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { useSelector } from 'react-redux';

import { selectUsedResumeColors } from '@/utils/resumeColorSelectors';
import { BASE_COLORS } from '@/lib/baseColors';

import styles from "../TextFormatting.module.css";

const ColorDropdown = ({ currentEditorColor, text=false, handleSetColor }) => {

  const usedColors = useSelector(selectUsedResumeColors);

  const [isOpen, setIsOpen] = useState(false);

  const handleCustomColor = (event) => {
    const hex = event.target.value;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    handleSetColor(`rgba(${r}, ${g}, ${b}, 1)`);
    setIsOpen(false);
  };

  const textFormatButtonStyling = { fontWeight: 'bold', boxShadow: `0 -0.35vh 0 ${currentEditorColor} inset` }

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dropdownRef = useClickOutside(closeDropdown, isOpen);

  return (
    <div className={styles.colorDropdownContainer}  ref={dropdownRef}>
      <button className='buttonMain' style={{...textFormatButtonStyling}} onClick={() => setIsOpen(o => !o)}>{text}</button>


      {isOpen && (
        <div className={styles.dropdownPanel}>
          {BASE_COLORS.map((color, index) => (
            <div
              key={index}
              className={styles.colorSwatch}
              style={{ backgroundColor: color }}
              onClick={() => {
                handleSetColor(color);
                setIsOpen(false);
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
                  setIsOpen(false);
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

export default ColorDropdown;
