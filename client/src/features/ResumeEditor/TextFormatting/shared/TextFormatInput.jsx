import React from 'react';

import styles from "../TextFormatting.module.css";

const TextFormatInput = ({ value, handleChange, commitChange, placeholder, styling }) => {

   return (
      <input
         onKeyDown={(e) => e.key === 'Enter' ? commitChange() : null}
         className={styles.textFormatInput}
         style={styling}
         value={value}
         onChange={(e) => handleChange(e.target.value)}
         placeholder={placeholder || ''}
      >
      </input>
   );
}

export default TextFormatInput;