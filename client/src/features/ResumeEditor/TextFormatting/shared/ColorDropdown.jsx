import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectUsedResumeColors } from '@/utils/resumeColorSelectors';
import { BASE_COLORS } from '@/lib/baseColors';

import TextFormatButton from './TextFormatButton';

import styles from "../TextFormatting.module.css";

const ColorDropdown = ({ currentEditorColor, text=false, handleSetColor }) => {

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
  //  const dispatch = useDispatch();
  //  const activeSectionId = useSelector(state => state.resume.activeSectionId);
  //  const resumeStyling = useSelector(state => state.resume.styling);

  //  const [currentEditorFontColor, setCurrentEditorFontColor] = useState('rgba(0, 0, 0, 1)');

  //  useEffect(() => {
  //     if (!editor || !selection) return;

  //     const currentFontColor = getActiveMark(editor, 'color');
  //     currentFontColor && setCurrentEditorFontColor(currentFontColor);
  //  }, [editor, selection])
  const textFormatButtonStyling = { fontWeight: 'bold', boxShadow: `0 -0.35vh 0 ${currentEditorColor} inset` }

  return (
    <div className={styles.colorDropdownContainer}>
      <button className='buttonMain' style={{...textFormatButtonStyling}} onClick={() => setOpen(o => !o)}>{text}</button>


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

export default ColorDropdown;
