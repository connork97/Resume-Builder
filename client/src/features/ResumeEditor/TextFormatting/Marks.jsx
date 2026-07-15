import React from "react";

import { toggleMark } from "../../../helpers/marks.js";

const Marks = ({ editor }) => {
  return (
    <>
      <button
        className="buttonMain"
        style={{ fontWeight: "bold" }}
        onClick={() => editor && toggleMark(editor, "bold")}
      >
        B
      </button>
      <button
        className="buttonMain"
        style={{ fontStyle: "italic" }}
        onClick={() => editor && toggleMark(editor, "italic")}
      >
        I
      </button>
      <button
        className="buttonMain"
        style={{ textDecoration: "underline" }}
        onClick={() => editor && toggleMark(editor, "underline")}
      >
        U
      </button>
      <button
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
