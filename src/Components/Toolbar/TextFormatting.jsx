import React from "react";
import styles from "./TextFormatting.module.css";

function TextFormatting() {
  const [activeFormats, setActiveFormats] = React.useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false
  });

  // Detect formatting when cursor moves
  React.useEffect(() => {
    const updateState = () => {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough")
      });
    };

    document.addEventListener("selectionchange", updateState);
    return () => document.removeEventListener("selectionchange", updateState);
  }, []);

const toggle = (command) => {
  const range = saveSelection();   // save cursor position
  restoreSelection(range);         // restore it before applying formatting
  document.execCommand(command, false, null);

  setActiveFormats((prev) => ({
    ...prev,
    [command]: !prev[command]
  }));
};

  const saveSelection = () => {
  const sel = window.getSelection();
  return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
};

const restoreSelection = (range) => {
  if (!range) return;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${activeFormats.bold ? styles.active : ""}`}
        onClick={() => toggle("bold")}
        onMouseDown={(e) => e.preventDefault()}
      >
        B
      </button>

      <button
        className={`${styles.button} ${activeFormats.italic ? styles.active : ""}`}
        onClick={() => toggle("italic")}
        onMouseDown={(e) => e.preventDefault()}
      >
        I
      </button>

      <button
        className={`${styles.button} ${activeFormats.underline ? styles.active : ""}`}
        onClick={() => toggle("underline")}
        onMouseDown={(e) => e.preventDefault()}
      >
        U
      </button>

      {/* <button
        className={`${styles.button} ${activeFormats.strikeThrough ? styles.active : ""}`}
        onClick={() => toggle("strikeThrough")}
        onMouseDown={(e) => e.preventDefault()}
      >
        S
      </button> */}

<button
  onMouseDown={(e) => e.preventDefault()}
  onClick={() => document.execCommand("insertUnorderedList")}
  className={styles.listButton}
>
  <span className={styles.listIcon}>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>

    <span className={styles.line}></span>
    <span className={styles.line}></span>
    <span className={styles.line}></span>
  </span>
</button>





    </div>
  );
}

export default TextFormatting;