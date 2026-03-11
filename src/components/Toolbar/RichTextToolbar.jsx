import React, { useState, useEffect } from "react";
import { useSlate } from "slate-react";
import { useSelector } from "react-redux";
import { toggleMark, isMarkActive, getActiveMark, setFontSize, setFontColor } from "../Slate/marks.js";
import { isBlockActive, toggleList, setAlignment } from '../Slate/blocks.js';

import { editorRegistry } from '../Slate/editorRegistry.js';

import ToolbarButton from "../Toolbar/ToolbarButton";
import ToolbarInput from "./ToolbarInput.jsx";
import ToolbarDropdown from './ToolbarDropdown.jsx';
import styles from "./RichTextToolbar.module.css";

const RichTextToolbar = () => {
  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const editor = editorRegistry.get(activeEditorId);
  const selection = useSelector(state => state.resume.activeEditorSelection);

  const [fontSizeInputValue, setFontSizeInputValue] = useState(12);
  const [currentEditorFontColor, setCurrentEditorFontColor] = useState("#000000");

  const setNewFontSize = (newFontSize = fontSizeInputValue) => {
    if (!editor) {
      console.error('Editor not found.');
      return;
    }
    if (newFontSize === 'increment') {
      let currentFontSize = getActiveMark(editor, 'fontSize');
      currentFontSize += 1;
      setFontSize(editor, currentFontSize);
      setFontSizeInputValue(currentFontSize);
    } else if (newFontSize === 'decrement') {
      let currentFontSize = getActiveMark(editor, 'fontSize');
      currentFontSize -= 1;
      setFontSize(editor, currentFontSize);
      setFontSizeInputValue(currentFontSize);
    } else {
      setFontSize(editor, newFontSize);
    }
  }

  const setNewFontColor = (newFontColor = currentEditorFontColor) => {
    setFontColor(editor, newFontColor);
    setCurrentEditorFontColor(newFontColor);
  }

  useEffect(() => {
    if (!editor || !selection) {
      console.error('Editor is not ready.');
      return;
    }
    console.log('Editor is ready.')

    const currentFontSize = getActiveMark(editor, 'fontSize');
    const currentFontColor = getActiveMark(editor, 'fontColor');

    setFontSizeInputValue(currentFontSize);
    setCurrentEditorFontColor(currentFontColor);
  }, [editor, selection])


  return (

    <div className={styles.toolbarContainer}>

      {/* FONT COLOR */}
      <ToolbarDropdown
        text="A"
        styling={{ fontWeight: 'bold', boxShadow: `0 -0.35vh 0 ${currentEditorFontColor} inset` }}
        handleSetFontColor={setNewFontColor}
        currentEditorFontColor={currentEditorFontColor}
      />



      {/* FONT SIZE */}
      <ToolbarButton
        text="-"
        styling={{}}
        active={editor && isMarkActive(editor, "fontSize")}
        command={() => editor && setNewFontSize('decrement')}
      />

      <ToolbarInput
        value={fontSizeInputValue}
        handleSetFontSizeInputValue={setFontSizeInputValue}
        handleSetNewFontSize={setNewFontSize}
      />

      <ToolbarButton
        text="+"
        styling={{}}
        active={editor && isMarkActive(editor, "fontSize")}
        command={() => editor && setNewFontSize('increment')}
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