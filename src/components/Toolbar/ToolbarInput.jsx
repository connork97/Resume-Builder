import React from 'react';

import styles from "./ToolbarButton.module.css";

const ToolbarInput = ({ value, setFontSizeInputValue, handleFontSizeSubmit }) => {

   console.log(value.length)
   return (
      <form 
         className={styles.toolbarButton}
         onSubmit={handleFontSizeSubmit}
         >
         <input
            className={styles.toolbarInput}
            value={value}
            style={{ width: `${value.length * 2}vh` }}
            onChange={(e) => setFontSizeInputValue(e.target.value)}
         >
      </input>
      px
      </form>
   );
}

export default ToolbarInput;