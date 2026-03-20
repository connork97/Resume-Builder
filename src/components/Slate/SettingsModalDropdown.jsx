import React, { useState } from 'react';
import styles from "./SettingsModal.module.css";

const settingsModalDropdown = ({ type, styling, options, handleSetLayout }) => {
  const [open, setOpen] = useState(false);
  const [openSubOptions, setOpenSubOptions] = useState(false);

  const capitalizedOptionType = (option) => {
    return option.charAt(0).toUpperCase() + option.slice(1);
  }

  return (
    <div className={styles.settingsModalDropdownContainerDiv}>
      <button
        className={styles.settingsModalDropdownButton}
        style={styling}
        onClick={() => setOpen(o => !o)}
      >
        {type}:
      </button>

      {open && (
        <div className={styles.settingsModalDropdownPanel}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.settingsModalOption}
            //   style={{ backgroundColor: color }}
              onClick={() => {
               //  handleSetLayout(type, option);
                setOpenSubOptions(!openSubOptions);
              }}
            >
               {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default settingsModalDropdown;