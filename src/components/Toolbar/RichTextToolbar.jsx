import React from "react";
import { useSlate } from "slate-react";
import { useSelector } from "react-redux";
import { toggleMark, isMarkActive } from "../Slate/marks.js";
import { toggleBlock, isBlockActive } from '../Slate/blocks.js';

import { editorRegistry } from '../Slate/editorRegistry.js';

import ToolbarButton from "../Toolbar/ToolbarButton";
import styles from "./RichTextToolbar.module.css";

const RichTextToolbar = () => {
  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const editor = editorRegistry.get(activeEditorId);

  return (
    <div className={styles.toolbarContainer}>
      <ToolbarButton
        text="B"
        styling={{ fontWeight: 'bold' }}
        active={editor && isMarkActive(editor, "bold")}
        command={() => editor && toggleMark(editor, "bold")}
      />
      <ToolbarButton
        text="I"
        styling={{ fontStyle: 'italic' }}
        active={editor && isMarkActive(editor, "italic")}
        command={() => editor && toggleMark(editor, "italic")}
      />
      <ToolbarButton
        text="U"
        styling={{ textDecoration: 'underline' }}
        active={editor && isMarkActive(editor, "underline")}
        command={() => editor && toggleMark(editor, "underline")}
      />
      <ToolbarButton
        text="•"
        active={editor && isBlockActive(editor, "bulleted-list")}
        command={() => editor && toggleBlock(editor, "bulleted-list")}
      />

      <ToolbarButton
        text="1."
        active={editor && isBlockActive(editor, "numbered-list")}
        command={() => editor && toggleBlock(editor, "numbered-list")}
      />

    </div>
  );
};

export default RichTextToolbar;