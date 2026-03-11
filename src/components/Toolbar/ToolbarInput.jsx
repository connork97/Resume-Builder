import React from 'react';

import styles from "./RichTextToolbar.module.css";

const ToolbarInput = ({ value, handleSetFontSizeInputValue, handleSetNewFontSize }) => {

   return (
      // <form 
         // className={styles.toolbarButton}
         // >
         <input
            onKeyDown={(e) => e.key === 'Enter' ? handleSetNewFontSize() : null}
            className={styles.toolbarInput}
            value={value}
            // style={{ width: `${value.length * 2}vh` }}
            onChange={(e) => handleSetFontSizeInputValue(e.target.value)}
         >
      </input>
      // </form>
   );
}

export default ToolbarInput;