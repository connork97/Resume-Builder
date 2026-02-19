import React, { useState, useEffect } from "react";
import styles from "./FontSize.module.css";
import { useFormatting } from "../../../hooks/useFormatting";
import FormattingButton from "./FormattingButton";

export default function FontSize({ formatting }) {
  const { activeFormats, saveSelection, applyFontSize } = formatting;

  // Local input state
  const [inputValue, setInputValue] = useState(activeFormats.fontSize);

  // Sync input when selection changes (but not while typing)
  useEffect(() => {
    setInputValue(activeFormats.fontSize);
  }, [activeFormats.fontSize]);

  const commitValue = () => {
    const px = parseFloat(inputValue);
    if (!isNaN(px)) {
      applyFontSize(px);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitValue();
      e.target.blur();
    }
  };

  const handleBlur = () => {
    commitValue();
  };

  const increase = () => {
    const newSize = activeFormats.fontSize + 1;
    setInputValue(newSize);
    applyFontSize(newSize);
  };

  const decrease = () => {
    const newSize = Math.max(1, activeFormats.fontSize - 1);
    setInputValue(newSize);
    applyFontSize(newSize);
  };

  return (
    <div className={styles.container}>
      {/* <button */}
      <FormattingButton
        className={styles.button}
        onMouseDown={saveSelection}
        onClick={decrease}
      >
        −
      </FormattingButton>
      {/* </button> */}

      <input
        className={styles.input}
        type="number"
        step="0.5"
        value={inputValue}
        onMouseDown={saveSelection}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />

      {/* <button */}
      <FormattingButton
        // className={styles.button}
        onMouseDown={saveSelection}
        onClick={increase}
      >
        +
      </FormattingButton>
      {/* </button> */}
    </div>
  );
}