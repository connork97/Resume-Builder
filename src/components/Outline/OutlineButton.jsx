import React from 'react';

import styles from "./Outline.module.css";

const OutlineButton = ({ className, clickCommand, state, setState, text }) => {
   return (
      <button
         className={className ? `${styles.outlineButton} ${className}` : styles.outlineButton}
         onClick={clickCommand}
      >
         {!state ? "⟨⟨⟨" : "⟩⟩⟩"}
      </button>
   )
}

export default OutlineButton;