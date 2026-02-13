import React from "react";
import styles from "./FontSize.module.css";

function FontSize({ fontSize, setFontSize }) {
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setFontSize(value);
    }
  };

  const increase = () => setFontSize((prev) => prev + 1);
  const decrease = () => setFontSize((prev) => Math.max(1, prev - 1));

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={decrease}>−</button>

      <input
        className={styles.input}
        type="number"
        value={fontSize}
        onChange={handleInputChange}
      />

      <button className={styles.button} onClick={increase}>+</button>
    </div>
  );
}

export default FontSize;