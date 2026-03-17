import React, { useState, useRef, useEffect } from "react";
import styles from "./Toolbar.module.css";

import RichTextToolbar from "./RichTextToolbar.jsx";
import AddSection from "./AddSection.jsx";

const Toolbar = () => {

  return (
    <div className={styles.toolbarContainerDiv}>
      <RichTextToolbar />
      <AddSection />
    </div>
  );
};

export default Toolbar;