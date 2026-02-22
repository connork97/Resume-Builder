import { useState, useRef, useEffect } from "react";
import styles from "./BackgroundColor.module.css";

export default function BackgroundColor({ formatting }) {
  const { activeFormats, applySectionFormatting, saveSelection } = formatting;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const colors = [
    "#ffffff",
    "#f8f9fa",
    "#fff3cd",
    "#d1ecf1",
    "#f8d7da",
    "#d4edda",
    "#e2e3e5",
    "#f0e5ff"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        className={styles.swatchButton}
        onMouseDown={(e) => {
          e.preventDefault();
          saveSelection();
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={styles.swatch}
          style={{ backgroundColor: activeFormats.backgroundColor }}
        />
        <span className={styles.arrow}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {colors.map((c) => (
            <button
              key={c}
              className={`${styles.colorOption} ${
                activeFormats.backgroundColor === c ? styles.active : ""
              }`}
              style={{ backgroundColor: c }}
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              onClick={() => {
                applySectionFormatting("backgroundColor", c)
              }}
            />
          ))}
          <div className={styles.customRow}>
            <label className={styles.customLabel}>Custom</label>

            <div
              className={styles.customSwatch}
              style={{ backgroundColor: activeFormats.backgroundColor }}
            >
              <input
                type="color"
                className={styles.colorInput}
                value={activeFormats.backgroundColor}
                onChange={(e) => {
                  applySectionFormatting("backgroundColor", e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}