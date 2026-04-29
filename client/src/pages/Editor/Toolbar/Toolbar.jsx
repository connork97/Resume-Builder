import React from "react";
import styles from "./Toolbar.module.css";

import { useSelector } from "react-redux";

import { editorRegistry } from "../../../helpers/editorRegistry.js";

import RichTextToolbar from "./RichTextToolbar.jsx";
import AddSection from "./AddSection.jsx";
import CurrentlyEditing from "./CurrentlyEditing.jsx";

const Toolbar = () => {

  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const editor = editorRegistry.get(activeEditorId);

  return (
    <div className={styles.toolbarContainerDiv}>
      {/* <div className={styles.belowToolbarWrapper}>
        <CurrentlyEditing editor={editor} />
        <AddSection />
      </div> */}
      <RichTextToolbar editor={editor} />
    </div>
  );
};

export default Toolbar;