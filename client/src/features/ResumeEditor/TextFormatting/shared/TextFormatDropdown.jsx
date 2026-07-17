import React, { useState } from "react";

import styles from "./SharedTextFormatting.module.css";

const TextFormatDropdown = ({ dropdownOptions=[], containerStyling={}, wrapperStyling={},  containerClassName='', wrapperClassName='' }) => {
  const [showTest, setShowTest] = useState(false);
  const dropdownRows = dropdownOptions?.map((option) => {
    if (option.elements) {
      return (
        <div style={option.styling}>
        {option.elements.map(element => {
          return element
        })}
      </div>
    );
  } else {
    return (
      <div className={containerClassName}
      // style={option.styling}
      >
        {option}
      </div>
    )
  }
  });

  return (
    <div className={styles.textFormatDropdownContainer}
     style={{...containerStyling}}
     >
      <div className={`${styles.textFormatDropdownWrapper} ${wrapperClassName}`} 
      style={{...wrapperStyling}}
      >
        {dropdownRows}
      </div>
    </div>
  );
};

export default TextFormatDropdown;
