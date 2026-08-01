import React, { useState, useCallback } from "react";
import useClickOutside from "@/hooks/useClickOutside.js";

import styles from "./SharedTextFormatting.module.css";

const TextFormatDropdown = ({
  isOpen,
  setIsOpen,
  dropdownOptions = [],
  containerStyling = {},
  wrapperStyling = {},
  containerClassName = "",
  wrapperClassName = "",
}) => {
  const [showTest, setShowTest] = useState(false);
  const dropdownRows = dropdownOptions?.map((option) => {
    if (option.elements) {
      return (
        <div style={option.styling}>
          {option.elements.map((element) => {
            return element;
          })}
        </div>
      );
    } else {
      return (
        <div
          className={containerClassName}
          // style={option.styling}
        >
          {option}
        </div>
      );
    }
  });

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dropdownRef = useClickOutside(closeDropdown, isOpen);

  return (
    <div
      className={styles.textFormatDropdownContainer}
      style={{ ...containerStyling }}
      ref={dropdownRef}
    >
      <div
        className={`${styles.textFormatDropdownWrapper} ${wrapperClassName}`}
        style={{ ...wrapperStyling }}
      >
        {dropdownRows}
      </div>
    </div>
  );
};

export default TextFormatDropdown;
