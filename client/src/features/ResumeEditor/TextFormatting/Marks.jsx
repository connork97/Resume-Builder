import React from "react";

import { isMarkActive, toggleMark } from "../../../helpers/marks.js";

import styles from "./TextFormatting.module.css";

const Marks = ({ editor }) => {

  return (
    <>
      <button data-toolbar-label="Bold"
        aria-label="Bold"
        aria-pressed={!!editor && isMarkActive(editor, "bold")}
        className={`buttonMain ${styles.markButton}`}
        onMouseDown={(event) => event.preventDefault()}
        style={{ fontWeight: "bold" }}
        onClick={() => editor && toggleMark(editor, "bold")}
      >
        B
      </button>
      <button data-toolbar-label="Italic"
        aria-label="Italic"
        aria-pressed={!!editor && isMarkActive(editor, "italic")}
        className={`buttonMain ${styles.markButton}`}
        onMouseDown={(event) => event.preventDefault()}
        style={{ fontStyle: "italic" }}
        onClick={() => editor && toggleMark(editor, "italic")}
      >
        I
      </button>
      <button data-toolbar-label="Underline"
        aria-label="Underline"
        aria-pressed={!!editor && isMarkActive(editor, "underline")}
        className={`buttonMain ${styles.markButton}`}
        onMouseDown={(event) => event.preventDefault()}
        style={{ textDecoration: "underline" }}
        onClick={() => editor && toggleMark(editor, "underline")}
      >
        U
      </button>
      <button data-toolbar-label="Strikethrough"
        aria-label="Strikethrough"
        aria-pressed={!!editor && isMarkActive(editor, "strikeThrough")}
        className={`buttonMain ${styles.markButton}`}
        onMouseDown={(event) => event.preventDefault()}
        style={{ textDecoration: "line-through" }}
        onClick={() => editor && toggleMark(editor, "strikeThrough")}
      >
        S
      </button>
    </>
  );
};

export default Marks;
