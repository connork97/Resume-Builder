import React from 'react';

import styles from "./RichTextToolbar.module.css";

const ToolbarInput = ({ value, handleSetFontSizeInputValue, handleSetNewFontSize }) => {

   return (
      <input
         onKeyDown={(e) => e.key === 'Enter' ? handleSetNewFontSize() : null}
         className={styles.toolbarInput}
         value={value}
         onChange={(e) => handleSetFontSizeInputValue(e.target.value)}
      >
      </input>
   );
}

export default ToolbarInput;