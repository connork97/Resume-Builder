import React, { useState } from "react";

import styles from "./SharedTextFormatting.module.css";

const TextFormatDropdown = ({ dropdownOptions, styling }) => {

   const [showTest, setShowTest] = useState(false)
  const dropdownRows = dropdownOptions?.map((option) => {
    return (
      <button
        key={option.value}
        className='buttonMain'
        // className={styles.textFormatDropdownRow}
        onClick={() => option.command?.()}
        style={{...styling}}
      //   onMouseEnter={() => setShowTest(true)}
      //   onMouseLeave={() => setShowTest(false)}
      >
        {option.icon}{showTest && 'test'}
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
