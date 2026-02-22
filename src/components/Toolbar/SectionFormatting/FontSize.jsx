import React, { useState, useEffect } from "react";
import styles from "./FontSize.module.css";
import ToolbarButton from "../ToolbarButton";

export default function FontSize({ formatting }) {
  const { activeFormats, saveSelection, applySectionFormatting } = formatting;

  // Local input state
  const [inputValue, setInputValue] = useState(activeFormats.fontSize);

  // Sync input when selection changes (but not while typing)
  useEffect(() => {
    setInputValue(activeFormats.fontSize);
  }, [activeFormats.fontSize]);

  const commitValue = () => {
    const px = parseFloat(inputValue);
    if (!isNaN(px)) {
      applySectionFormatting("fontSize", px);
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
    applySectionFormatting("fontSize", newSize)
  };

  const decrease = () => {
    const newSize = Math.max(1, activeFormats.fontSize - 1);
    setInputValue(newSize);
    applySectionFormatting("fontSize", newSize)
  };

  return (
    <div className={styles.container}>
      <ToolbarButton
        className={styles.button}
        onMouseDown={saveSelection}
        onClick={decrease}
      >
        −
      </ToolbarButton>

      <input
        className={styles.input}
        type="number"
        step="0.5"
        value={inputValue}
        onFocusCapture={saveSelection}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />

      <ToolbarButton
        className={styles.button}
        onMouseDown={saveSelection}
        onClick={increase}
      >
        +
      </ToolbarButton>
    </div>
  );
}