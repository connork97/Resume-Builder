import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { editorRegistry } from "@/helpers/editorRegistry.js";

import RichTextToolbar from "./components/RichTextToolbar.jsx";
import TopBar from "./components/TopBar";
// import AddSection from "./AddSection.jsx";
// import CurrentlyEditing from "./CurrentlyEditing.jsx";
import styles from "./Toolbar.module.css";

const Toolbar = () => {

  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const editor = editorRegistry.get(activeEditorId);

  return (
    <div className={styles.toolbarContainer}>

      <Link
        to='/home'
        className={styles.homeLink}
      >
        Home
      </Link>
      <div className={styles.toolbarContent}>
        <TopBar />
        <RichTextToolbar editor={editor} />
      </div>
    </div>
  );
};

export default Toolbar;