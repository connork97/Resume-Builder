import React, { useState, useEffect, useRef } from "react";
import styles from "./Section.module.css";

function Section({ id, content, updateSection }) {
  const [text, setText] = useState(content || "");
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerText = text;
    }
  }, []);

  const handleInput = (e) => {
    const newValue = e.target.innerText;
    setText(newValue);
    updateSection(id, newValue);
  };

  return (
    <div
      ref={divRef}
      className={styles.section}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
    />
  );
}

export default Section;
