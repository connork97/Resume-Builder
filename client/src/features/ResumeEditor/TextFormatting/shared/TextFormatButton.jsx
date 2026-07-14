import React from 'react';

import styles from '../TextFormatting.module.css';

const TextFormatButton = (props) => {

   return (
      <button
         className={styles.textFormatButton}
         onClick={props.onClick || props.command}
         // style={{...props.styling}}
         style={{...props.styling, display: 'flex', alignItems: 'center'}}
         text={props.text || props.value}
         value={props.value}
      >
         {props.icon}
         {props.text}
      </button>
   );
}

export default TextFormatButton;