import React, { useState } from "react";

import styles from "./SharedTextFormatting.module.css";

const TextFormatDropdown = ({ dropdownOptions, styling }) => {
  const [showTest, setShowTest] = useState(false);
  const dropdownRows = dropdownOptions?.map((option) => {
    return (
      <div style={option.styling}>
        {option.elements.map((element) => {
          if (!element.skipButton) {

            return (
              <button
              key={option.value}
              className="buttonMain"
              onClick={() => option.command?.()}
              >
            {element}
            {showTest && "test"}
          </button>
          );
        } else return <p>HIYA</p>
        })}
      </div>
    );
  });

  return (
    <div className={styles.textFormatDropdownContainer}>
      <div className={styles.textFormatDropdownWrapper} style={styling}>
        {dropdownRows}
      </div>
    </div>
  );
};

export default TextFormatDropdown;
