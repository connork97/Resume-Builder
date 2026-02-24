import React from "react";

import styles from "./Toolbar.module.css";

import ToolbarButton from "./ToolbarButton";

const Toolbar = () => {
   return (
      <div className={styles.toolbarContainerDiv}>
         <ToolbarButton />
      </div>
   );
}

export default Toolbar;