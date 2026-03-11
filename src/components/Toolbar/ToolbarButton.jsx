import React from "react";

import styles from "./RichTextToolbar.module.css";

const ToolbarButton = (props) => {

   return (
      <button
         className={styles.toolbarButton}
         onClick={props.command}
         style={props.styling}
         value={props.text}
      >
         {props.text}
      </button>
   );
}

export default ToolbarButton;