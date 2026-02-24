import React from "react";

import styles from "./ToolbarButton.module.css";

const ToolbarButton = (props) => {

   return (
      <button
         className={styles.toolbarButton}
         onClick={props.command}
      >
         {props.text}
      </button>
   );
}

export default ToolbarButton;