import React, { useState, useEffect } from "react";
import { useSlate } from "slate-react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveEditorId, setActiveSection, updateResumeStyling, updateSection } from "../../store/resumeSlice.js";
import { toggleMark, isMarkActive, getActiveMark, setFontSize, setLineHeight, setFontColor, setHighlightColor } from "../Slate/helpers/marks.js";
import { isBlockActive, toggleList, setAlignment } from '../Slate/helpers/blocks.js';

import { editorRegistry } from '../Slate/helpers/editorRegistry.js';

import ToolbarButton from "../Toolbar/ToolbarButton";
import ToolbarInput from "./ToolbarInput.jsx";
import ToolbarDropdown from './ToolbarDropdown.jsx';
import styles from "./RichTextToolbar.module.css";

const RichTextToolbar = () => {
  const dispatch = useDispatch();
  const resumeStyling = useSelector((state) => state.resume.styling);
  const sections = useSelector((state) => state.resume.sections);
  const activeSectionId = useSelector(state => state.resume.activeSectionId);
  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const selection = useSelector(state => state.resume.activeEditorSelection);
  const editor = editorRegistry.get(activeEditorId);

  const activeSectionTitle = sections.find(section => section.id === activeSectionId)?.label;

  const [fontSizeInputValue, setFontSizeInputValue] = useState(parseInt(resumeStyling.fontSize));
  const [lineHeightInputValue, setLineHeightInputValue] = useState(parseFloat(resumeStyling.lineHeight));
  const [currentEditorFontColor, setCurrentEditorFontColor] = useState('rgba(0, 0, 0, 1)');
  const [currentEditorHighlightColor, setCurrentEditorHighlightColor] = useState("rgba(255, 255, 255, 0.5)");


  const clearToolbarSelection = () => {
    dispatch(setActiveEditorId(null));
    dispatch(setActiveSection(null));
    setFontSizeInputValue(parseInt(resumeStyling.fontSize));
    // useSelector((state) => {state.resume.activeSectionId = null});

  }

  const handleSetSectionBackgroundColor = (color) => {
    // console.log(color, activeSectionId);
    if (!activeSectionId) {
      dispatch(updateResumeStyling({ backgroundColor: color }));
      return;
    }
    dispatch(updateSection({
      id: activeSectionId,
      changes: { styling: { backgroundColor: color } }
    }));
  };

  const setNewFontSize = (newFontSize = fontSizeInputValue) => {
    if (!editor) {
      // console.error('Editor not found.');
      let resumeFontSize = parseInt(resumeStyling.fontSize);
      console.log(resumeFontSize)
      if (newFontSize === 'increment') {
        resumeFontSize += 1;
      } else if (newFontSize === 'decrement') {
        resumeFontSize -= 1;
      } else {
        resumeFontSize = fontSizeInputValue;
      }
      dispatch(updateResumeStyling({ fontSize: `${resumeFontSize}px` }));
      setFontSizeInputValue(resumeFontSize);
      return;
    }
    if (newFontSize === 'increment') {
      let currentFontSize = getActiveMark(editor, 'fontSize') || parseInt(fontSizeInputValue);
      currentFontSize += 1;
      setFontSize(editor, currentFontSize);
      setFontSizeInputValue(currentFontSize);
    } else if (newFontSize === 'decrement') {
      let currentFontSize = getActiveMark(editor, 'fontSize') || parseInt(fontSizeInputValue);
      currentFontSize -= 1;
      setFontSize(editor, currentFontSize);
      setFontSizeInputValue(currentFontSize);
    } else {
      setFontSize(editor, newFontSize);
    }
  }

  const setNewLineHeight = (newLineHeight = lineHeightInputValue) => {
    if (!editor) {
      // console.error('Editor not found.');
      let resumeLineHeight = parseFloat(resumeStyling.lineHeight).toFixed(1);
      console.log(resumeLineHeight)
      if (newLineHeight === 'increment') {
        resumeLineHeight = (parseFloat(resumeLineHeight) + 0.1).toFixed(1);
      } else if (newLineHeight === 'decrement') {
        resumeLineHeight = (parseFloat(resumeLineHeight) - 0.1).toFixed(1);
      } else {
        resumeLineHeight = parseFloat(lineHeightInputValue).toFixed(1);
      }
      dispatch(updateResumeStyling({ lineHeight: resumeLineHeight }));
      setLineHeightInputValue(resumeLineHeight);
      return;
    }
    if (newLineHeight === 'increment') {
      let currentLineHeight = getActiveMark(editor, 'lineHeight') || parseFloat(lineHeightInputValue);
        currentLineHeight = (parseFloat(currentLineHeight) + 0.1).toFixed(1);
      setLineHeight(editor, currentLineHeight);
      setLineHeightInputValue(currentLineHeight);
    } else if (newLineHeight === 'decrement') {
      let currentLineHeight = getActiveMark(editor, 'lineHeight') || parseFloat(lineHeightInputValue);
        currentLineHeight = (parseFloat(currentLineHeight) - 0.1).toFixed(1);
      setLineHeight(editor, currentLineHeight);
      setLineHeightInputValue(currentLineHeight);
    } else {
      setLineHeight(editor, newLineHeight);
    }
  }

  const setNewFontColor = (newFontColor = currentEditorFontColor) => {
    setFontColor(editor, newFontColor);
    setCurrentEditorFontColor(newFontColor);
  }

  const setNewHighlightColor = (newHighlightColor = currentEditorHighlightColor) => {
    setHighlightColor(editor, newHighlightColor);
    setCurrentEditorHighlightColor(newHighlightColor);
  }

  useEffect(() => {
    if (!editor || !selection) {
      console.error('Editor is not ready.');
      return;
    }
    console.log('Editor is ready.')

    const currentFontSize = getActiveMark(editor, 'fontSize');
    const currentFontColor = getActiveMark(editor, 'color');
    const currentLineHeight = getActiveMark(editor, 'lineHeight');
    currentFontSize && setFontSizeInputValue(currentFontSize);
    // setFontSizeInputValue(currentFontSize);
    currentFontColor && setCurrentEditorFontColor(currentFontColor);
    // setCurrentEditorFontColor(currentFontColor);
    currentLineHeight && setLineHeightInputValue(currentLineHeight);

  }, [editor, selection])


  return (

    <div className={styles.toolbarContainer}>
      {/* LINE HEIGHT */}
      <ToolbarButton
        text="-"
        styling={{}}
        active={editor && isMarkActive(editor, "lineHeight")}
        command={() => setNewLineHeight('decrement')}
      />

      <ToolbarInput
        value={lineHeightInputValue}
        handleSetFontSizeInputValue={setLineHeightInputValue}
        handleSetNewFontSize={setNewLineHeight}
      />

      <ToolbarButton
        text="+"
        styling={{}}
        active={editor && isMarkActive(editor, "lineHeight")}
        command={() => setNewLineHeight('increment')}
      />


      {/* FONT COLOR */}
      <ToolbarDropdown
        text="A"
        styling={{ fontWeight: 'bold', boxShadow: `0 -0.35vh 0 ${currentEditorFontColor} inset` }}
        handleSetColor={setNewFontColor}
      />

      {/* HIGHLIGHT COLOR */}
      <ToolbarDropdown
        text="HC"
        styling={{}}
        handleSetColor={setNewHighlightColor}
      />

      {/* SECTION BACKGROUND COLOR */}
      <ToolbarDropdown
        text="BC"
        styling={{}}
        handleSetColor={handleSetSectionBackgroundColor}
      />

      {/* FONT SIZE */}
      <ToolbarButton
        text="-"
        styling={{}}
        active={editor && isMarkActive(editor, "fontSize")}
        command={() => setNewFontSize('decrement')}
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
        command={() => setNewFontSize('increment')}
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
        command={() => editor && toggleList(editor, "unordered-list")}
      />

      <ToolbarButton
        text="1."
        active={editor && isBlockActive(editor, "ordered-list")}
        command={() => editor && toggleList(editor, "ordered-list")}
      />
      <ToolbarButton
        text={`Currently Editing: ${activeSectionTitle ? activeSectionTitle : 'Full Resume'}. Click to reset.`}
        command={() => clearToolbarSelection()}
      />

    </div>
  );
};

export default RichTextToolbar;