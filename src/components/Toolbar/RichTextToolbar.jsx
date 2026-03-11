import React, { useState, useEffect } from "react";
import { useSlate } from "slate-react";
import { useSelector } from "react-redux";
import { toggleMark, isMarkActive, getActiveFontSize, setFontSize, incrementFontSize, decrementFontSize } from "../Slate/marks.js";
import { isBlockActive, toggleList, setAlignment } from '../Slate/blocks.js';

import { editorRegistry } from '../Slate/editorRegistry.js';

import ToolbarButton from "../Toolbar/ToolbarButton";
import styles from "./RichTextToolbar.module.css";
import ToolbarInput from "./ToolbarInput.jsx";

const RichTextToolbar = () => {
  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const editor = editorRegistry.get(activeEditorId);

  const selection = useSelector(state => state.resume.activeEditorSelection);

  const [editorToggle, setEditorToggle] = useState(true);
  const [fontSizeInputValue, setFontSizeInputValue] = useState('12');

  useEffect(() => {
    if (!editor || !selection) {
      console.log('editor is not ready');
      return;
    }
    console.log('editor is ready')
    const currentEditorFontSize = getActiveFontSize(editor);
    // const parsedCurrentEditorFontSize = parseInt(currentEditorFontSize);
    setFontSizeInputValue(currentEditorFontSize);
  }, [editor, selection])


  return (

    <div className={styles.toolbarContainer}>
      {/* FONT SIZE */}
      <ToolbarButton
        text="-"
        styling={{}}
        active={editor && isMarkActive(editor, "fontSize")}
        command={() => editor && decrementFontSize(editor)}
      />

      <ToolbarInput
        value={fontSizeInputValue}
        setFontSizeInputValue={setFontSizeInputValue}
        handleFontSizeSubmit={(e) => {
          e.preventDefault();
          setFontSize(editor, fontSizeInputValue);
        }
        }
      />

      <ToolbarButton
        text="+"
        styling={{}}
        active={editor && isMarkActive(editor, "fontSize")}
        command={() => editor && incrementFontSize(editor)}
      />

      {/* INLINE TEXT FORMATTING */}
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
        text="S"
        styling={{ textDecoration: 'line-through' }}
        active={editor && isMarkActive(editor, "strikeThrough")}
        command={() => editor && toggleMark(editor, "strikeThrough")}
      />

      {/* TEXT ALIGNMENT */}
      <ToolbarButton
        text="L"
        styling={{}}
        active={editor && isBlockActive(editor, "left")}
        command={() => editor && setAlignment(editor, "left")}
      />
      <ToolbarButton
        text="C"
        styling={{}}
        active={editor && isBlockActive(editor, "center")}
        command={() => editor && setAlignment(editor, "center")}
      />
      <ToolbarButton
        text="R"
        styling={{}}
        active={editor && isBlockActive(editor, "right")}
        command={() => editor && setAlignment(editor, "right")}
      />
      <ToolbarButton
        text="J"
        styling={{}}
        active={editor && isBlockActive(editor, "justify")}
        command={() => editor && setAlignment(editor, "justify")}
      />



      {/* LISTS */}
      <ToolbarButton
        text="•"
        active={editor && isBlockActive(editor, "unordered-list")}
        command={() => editor && setAlignment(editor, "unordered-list")}
      />

      <ToolbarButton
        text="1."
        active={editor && isBlockActive(editor, "ordered-list")}
        command={() => editor && toggleList(editor, "ordered-list")}
      />

    </div>
  );
};

export default RichTextToolbar;