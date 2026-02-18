import styles from "./TextAlign.module.css";

export default function TextAlign({ formatting }) {
  const { activeFormats, applyTextAlign } = formatting;

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${
          activeFormats.textAlign === "left" ? styles.active : ""
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("left")}
      >
        L
      </button>

      <button
        className={`${styles.button} ${
          activeFormats.textAlign === "center" ? styles.active : ""
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("center")}
      >
        C
      </button>

      <button
        className={`${styles.button} ${
          activeFormats.textAlign === "right" ? styles.active : ""
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("right")}
      >
        R
      </button>

      <button
        className={`${styles.button} ${
          activeFormats.textAlign === "justify" ? styles.active : ""
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("justify")}
      >
        J
      </button>
    </div>
  );
}