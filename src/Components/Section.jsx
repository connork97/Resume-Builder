import React, { useState, useEffect, useRef } from "react";
import styles from "./Section.module.css";

function Section({
  id,
  index,
  content,
  updateSection,
  autoFocus,
  handleReorder,
  handleDelete
}) {
  const [text, setText] = useState(content || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    if (autoFocus && divRef.current) {
      divRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== content) {
      divRef.current.innerText = content;
    }
  }, [content]);

  const handleInput = (e) => {
    const newValue = e.target.innerText;
    setText(newValue);
    updateSection(id, newValue);
  };

  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => setIsDragOver(false);

  const onDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    handleReorder(fromIndex, index);
    setIsDragOver(false);
  };

  return (
    <div className={styles.sectionWrapper}>
      {/* DELETE BUTTON */}
      <button
        className={styles.deleteButton}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      {/* CONTENTEDITABLE DIV */}
      <div
        ref={divRef}
        className={`${styles.section} ${isDragOver ? styles.dragOver : ""}`}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {""}
      </div>
    </div>
  );
}

export default Section;