import React from 'react';

import styles from "../TextFormatting.module.css";

const TextFormatInput = ({ value, handleChange, commitChange }) => {

   return (
      <input
         onKeyDown={(e) => e.key === 'Enter' ? commitChange() : null}
         className={styles.textFormatInput}
         value={value}
         onChange={(e) => handleChange(e.target.value)}
      >
      </input>
   );
}

export default TextFormatInput;