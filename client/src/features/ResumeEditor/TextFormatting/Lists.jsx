import React from "react";

import { isBlockActive, toggleList } from "../../../helpers/blocks";

import styles from "./TextFormatting.module.css";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";

const Lists = ({ editor }) => {
  return (
    <div className={styles.toolbarFlexWrapper}>
      <button
        data-toolbar-label="Bulleted List"
        aria-label="Bulleted List"
        aria-pressed={
          !!editor?.selection && isBlockActive(editor, "unordered-list")
        }
        className={`buttonMain ${styles.listButton}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => editor && toggleList(editor, "unordered-list")}
      >
        <MdFormatListBulleted style={{ position: "relative", top: "0.1em" }} />
      </button>

      <button
        data-toolbar-label="Numbered List"
        aria-label="Numbered List"
        aria-pressed={
          !!editor?.selection && isBlockActive(editor, "ordered-list")
        }
        className={`buttonMain ${styles.listButton}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => editor && toggleList(editor, "ordered-list")}
      >
        <MdFormatListNumbered style={{ position: "relative", top: "0.1em" }} />
      </button>
    </div>
  );
};

export default Lists;
