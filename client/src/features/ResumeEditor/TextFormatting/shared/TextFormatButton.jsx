import React from 'react';

import styles from '../TextFormatting.module.css';

const TextFormatButton = (props) => {

   return (
      <button
         className={styles.textFormatButton}
         onClick={props.onClick}
         style={props.styling}
         text={props.text || props.value}
         value={props.value}
      >
         {props.text}
      </button>
   );
}

export default TextFormatButton;