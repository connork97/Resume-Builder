import React from "react";

import styles from "./SharedTextFormatting.module.css";

const TextFormatDropdown = ({ dropdownOptions }) => {
  const dropdownRows = dropdownOptions?.map((option) => {
    return (
      <button
        key={option.value}
        className={styles.textFormatDropdownRow}
        onClick={() => option.command?.()}
      >
        {option.icon}
      </button>
    );
  });

  return (
    <div className={styles.textFormatDropdownContainer}>
      <div className={styles.textFormatDropdownWrapper}>{dropdownRows}</div>
    </div>
  );
};

export default TextFormatDropdown;
