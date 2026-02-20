import styles from "./TextAlign.module.css";
import FormattingButton from "./FormattingButton";

export default function TextAlign({ formatting }) {
  const { activeFormats, applyTextAlign } = formatting;

  return (
    <div className={styles.container}>
      <FormattingButton
        // className={`${styles.button} ${
        //   activeFormats.textAlign === "left" ? styles.active : ""
        // }`}
        active={activeFormats.textAlign === "left"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("left")}
      >
        L
      </FormattingButton>

      <FormattingButton
        // className={`${styles.button} ${
        //   activeFormats.textAlign === "center" ? styles.active : ""
        // }`}
        active={activeFormats.textAlign === "center"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("center")}
      >
        C
      </FormattingButton>

      <FormattingButton
        // className={`${styles.button} ${
        //   activeFormats.textAlign === "right" ? styles.active : ""
        // }`}
        active={activeFormats.textAlign === "right"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("right")}
      >
        R
      </FormattingButton>

      <FormattingButton
        // className={`${styles.button} ${
        //   activeFormats.textAlign === "justify" ? styles.active : ""
        // }`}
        active={activeFormats.textAlign === "justify"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign("justify")}
      >
        J
      </FormattingButton>
    </div>
  );
}