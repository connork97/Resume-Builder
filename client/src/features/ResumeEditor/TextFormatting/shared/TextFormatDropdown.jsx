import React, { useState } from "react";

import styles from "./SharedTextFormatting.module.css";

const TextFormatDropdown = ({ dropdownOptions=[], containerStyling={}, wrapperStyling={} }) => {
  const [showTest, setShowTest] = useState(false);
  const dropdownRows = dropdownOptions?.map((option) => {
    return (
      <div style={option.styling}>
        {option.elements.map(element => {
          return element
        })}
      </div>
    );
  });

  return (
    <div className={styles.textFormatDropdownContainer}
     style={{...containerStyling}}
     >
      <div className={styles.textFormatDropdownWrapper} 
      style={{...wrapperStyling}}
      >
        {dropdownRows}
      </div>
    </div>
  );
};

export default TextFormatDropdown;
