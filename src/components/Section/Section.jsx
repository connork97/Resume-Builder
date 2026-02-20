import React, { useEffect, useRef, useState } from "react";
import styles from "./Section.module.css";

function Section({
  id,
  index,
  totalSections,
  content,
  fontSize,
  textAlign,
  backgroundColor,
  updateSection,
  autoFocus,
  handleReorder,
  handleDelete
}) {
  const divRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Autofocus when section is created
  useEffect(() => {
    if (autoFocus && divRef.current) {
      divRef.current.focus();
    }
  }, [autoFocus]);

  // Keep DOM in sync with content from state
  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== content) {
      divRef.current.innerHTML = content || "";
    }
  }, [content]);

  // Update parent state when user types
  const handleInput = (e) => {
    const html = e.target.innerHTML;
    updateSection(id, html, undefined, undefined);
  };

  // Drag and drop handlers
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

const getSpacing = () => {
  if (index === 0) {
    return {
      marginTop: "-2rem",
      paddingTop: "2rem"
    };
  } else if (index === (totalSections - 1)) {
    return {
      // paddingBottom: "fit-content"
    };
  }
  return {};
};


  return (
    <div
      className={styles.sectionWrapper}
      style={{ backgroundColor: backgroundColor, ...getSpacing() }}>
      {/* Delete button */}
      <button
        className={styles.deleteButton}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      {/* Editable content */}
      <div
        data-id={id}
        ref={divRef}
        className={`section ${styles.section} ${isDragOver ? styles.dragOver : ""}`}
        style={{ fontSize: `${fontSize}px`, textAlign: textAlign, backgroundColor: backgroundColor }}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
    </div>
  );
}

export default Section;