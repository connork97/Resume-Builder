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

  const handleDropdownOverflow = (ref) => {
    const rect = ref.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    console.log('VIEWPORT WIDTH', viewportWidth);
    console.log('DROPDOWN RECT', rect);

    // If the right edge goes past the screen, shift it left by the overflow amount
    if (rect.right >= viewportWidth) {
      ref.current.style.left = "auto";
      ref.current.style.right = "0px";
    } else {
      // Reset if it fits normally
      ref.current.style.left = "";
      ref.current.style.right = "";
    }
  };
  return (
    <div
      className={styles.textFormatDropdownContainer}
      style={{ ...containerStyling }}
      ref={(ref) => {
        dropdownRef.current = ref;
        if (ref) handleDropdownOverflow({ current: ref });
      }}
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
