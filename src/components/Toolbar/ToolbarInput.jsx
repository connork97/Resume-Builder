import React from 'react';

import styles from "./RichTextToolbar.module.css";

const ToolbarInput = ({ value, handleChange, commitChange }) => {

   return (
      <input
         onKeyDown={(e) => e.key === 'Enter' ? commitChange() : null}
         className={styles.toolbarInput}
         value={value}
         onChange={(e) => handleChange(e.target.value)}
      >
      </input>
   );
}

export default ToolbarInput;