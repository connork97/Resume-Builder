import React from "react";

import { toggleMark } from "../../../helpers/marks.js";

const Marks = ({ editor }) => {

  return (
    <>
      <button data-toolbar-label="Bold"
        className="buttonMain"
        style={{ fontWeight: "bold" }}
        onClick={() => editor && toggleMark(editor, "bold")}
      >
        B
      </button>
      <button data-toolbar-label="Italic"
        className="buttonMain"
        style={{ fontStyle: "italic" }}
        onClick={() => editor && toggleMark(editor, "italic")}
      >
        I
      </button>
      <button data-toolbar-label="Underline"
        className="buttonMain"
        style={{ textDecoration: "underline" }}
        onClick={() => editor && toggleMark(editor, "underline")}
      >
        U
      </button>
      <button data-toolbar-label="Strikethrough"
        className="buttonMain"
        style={{ textDecoration: "line-through" }}
        onClick={() => editor && toggleMark(editor, "strikeThrough")}
      >
        S
      </button>
    </>
  );
};

export default Marks;
