import React from "react";

import styles from "./SharedToolbar.module.css";

const ToolbarButton = (props) => {

   return (
      <button
         className={styles.toolbarButton}
         onClick={props.command}
         style={props.styling}
         text={props.text || props.value}
         value={props.value}
      >
         {props.text}
      </button>
   );
}

export default ToolbarButton;