import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { editorRegistry } from "@/helpers/editorRegistry.js";

import RichTextToolbar from "./components/RichTextToolbar.jsx";
import TopBar from "./components/TopBar";

import styles from "./Toolbar.module.css";
import { Margins } from "../ResumePaper/components/Margins.jsx";

const Toolbar = ({ handlePrint }) => {

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
        <TopBar handlePrint={handlePrint} />
        <RichTextToolbar editor={editor} />
      </div>
      {/* <Margins /> */}
    </div>
  );
};

export default Toolbar;