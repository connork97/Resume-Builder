import React, { useState, useEffect } from "react";
import { useSlate } from "slate-react";
import { Node } from "slate";
import { useSelector, useDispatch } from "react-redux";

import { setActiveEditorId, setActiveSectionId, updateResumeStyling, updateSection } from "../../store/resumeSlice.js";
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
  const activeSection = sections.find(section => section.id === activeSectionId);
  const activeSectionText = activeSection ? Node.string({ children: activeSection?.value ?? [] }) : null;

  const activeEditorId = useSelector((state) => state.resume.activeEditorId);
  const editor = editorRegistry.get(activeEditorId);
  // const activeEditor = editorRegistry.get(activeEditorId);
  const activeEditorText = editor ? Node.string(editor) : null;
  console.log('ACTIVE EDITOR', editor)
  // const activeEditorLabel = activeEditor?.label;
  const activeEditorLabel = editor?.children[0].label;

  const selection = useSelector(state => state.resume.activeEditorSelection);
  const currentSelectionText = selection ? Node.string({ children: selection }) : null;
  // console.log('SELECTION', Node.string({selection}))
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

  const [currentlyEditingText, setCurrentlyEditingText] = useState('Full Resume');

  useEffect(() => {
    if (activeSectionText && activeEditorText && activeSectionText !== activeEditorText) {
      setCurrentlyEditingText(`${activeSectionText} > ${activeEditorLabel}`);
    } else if (activeEditorText) {
      setCurrentlyEditingText(activeEditorText);
    } else if (activeSectionText) {
      setCurrentlyEditingText(activeSectionText);
    } else {
      setCurrentlyEditingText('Full Resume');
    }
  }, [activeSectionText, activeEditorText])
  // currentSelectionText ? (activeSectionText + '>' + currentSelectionText) : activeSectionText || 'Full Resume'

  const [fontSizeInputValue, setFontSizeInputValue] = useState(parseInt(resumeStyling.fontSize));
  const [lineHeightInputValue, setLineHeightInputValue] = useState(parseFloat(resumeStyling.lineHeight));
  const [currentEditorFontColor, setCurrentEditorFontColor] = useState('rgba(0, 0, 0, 1)');
  const [currentEditorHighlightColor, setCurrentEditorHighlightColor] = useState("rgba(255, 255, 255, 0.5)");

  const clearToolbarSelection = () => {
    dispatch(setActiveEditorId(null));
    dispatch(setActiveSectionId(null));
    setFontSizeInputValue(parseInt(resumeStyling.fontSize));
    // useSelector((state) => {state.resume.activeSectionId = null});
  }

  const handleSetSectionBackgroundColor = (color) => {
    if (!activeSectionId) {
      dispatch(updateResumeStyling({ backgroundColor: color }));
      return;
    }
    dispatch(updateSection({
      sectionId: activeSectionId,
      changes: { styling: { backgroundColor: color } }
    }));
  };

  const findFontSizeValue = (fontSizeToChange, value) => {
    fontSizeToChange = parseInt(fontSizeToChange);
    if (value === 'increment') {
      fontSizeToChange += 1;
    } else if (value === 'decrement') {
      fontSizeToChange -= 1;
    } else {
      fontSizeToChange = fontSizeInputValue;
    }
    return fontSizeToChange;
  }

  const setNewFontSize = (newFontSize = fontSizeInputValue) => {
    if (!editor && !activeSectionId) {
      let resumeFontSize = parseInt(resumeStyling.fontSize);
      resumeFontSize = findFontSizeValue(resumeFontSize, newFontSize);
      dispatch(updateResumeStyling({ fontSize: `${resumeFontSize}px` }));
      setFontSizeInputValue(resumeFontSize);
      return;
    } else if (!editor && activeSectionId) {
      const section = sections.find(s => s.id === activeSectionId);
      let sectionFontSize = parseInt(section.styling.fontSize || resumeStyling.fontSize);
      sectionFontSize = findFontSizeValue(sectionFontSize, newFontSize);
      dispatch(updateSection({
        sectionId: activeSectionId,
        changes: { styling: { fontSize: `${sectionFontSize}px` } }
      }));
      setFontSizeInputValue(sectionFontSize);
    } else if (editor) {
      let currentFontSize = getActiveMark(editor, 'fontSize') || parseInt(fontSizeInputValue);
      console.log('Current font size before change:', currentFontSize);
      currentFontSize = findFontSizeValue(currentFontSize, newFontSize);
      setFontSize(editor, `${currentFontSize}`);
      setFontSizeInputValue(currentFontSize);
    }
  }

  const findLineHeightValue = (lineHeightToChange, value) => {
    // lineHeightToChange = (parseFloat(lineHeightToChange) + 0.1).toFixed(1);
    if (value === 'increment') {
      lineHeightToChange = (parseFloat(lineHeightToChange) + 0.1).toFixed(1);
    } else if (value === 'decrement') {
      lineHeightToChange = (parseFloat(lineHeightToChange) - 0.1).toFixed(1);
    } else {
      lineHeightToChange = parseFloat(lineHeightInputValue).toFixed(1);
    }
    return lineHeightToChange;
  }

  const setNewLineHeight = (newLineHeight = lineHeightInputValue) => {
    if (!editor && !activeSectionId) {
      let resumeLineHeight = parseFloat(resumeStyling.lineHeight).toFixed(1);
      resumeLineHeight = findLineHeightValue(resumeLineHeight, newLineHeight);
      dispatch(updateResumeStyling({ lineHeight: resumeLineHeight }));
      setLineHeightInputValue(resumeLineHeight);
    } else if (!editor && activeSectionId) {
      const section = sections.find(s => s.id === activeSectionId);
      let sectionLineHeight = parseFloat(section.styling.lineHeight || resumeStyling.lineHeight).toFixed(1);
      sectionLineHeight = findLineHeightValue(sectionLineHeight, newLineHeight);
      dispatch(updateSection({
        sectionId: activeSectionId,
        changes: { styling: { lineHeight: sectionLineHeight } }
      }));
      setLineHeightInputValue(sectionLineHeight);
    }
    else if (editor) {
      let currentLineHeight = getActiveMark(editor, 'lineHeight') || parseFloat(lineHeightInputValue).toFixed(1);
      currentLineHeight = findLineHeightValue(currentLineHeight, newLineHeight);
      setLineHeight(editor, currentLineHeight);
      setLineHeightInputValue(currentLineHeight);
    }
  }

  const setNewFontColor = (newFontColor = currentEditorFontColor) => {
    if (!editor && !activeSectionId) {
      dispatch(updateResumeStyling({ color: newFontColor }));
      setCurrentEditorFontColor(newFontColor);
      return;
    } else if (!editor && activeSectionId) {
      dispatch(updateSection({
        sectionId: activeSectionId,
        changes: { styling: { color: newFontColor } }
      }));
      setCurrentEditorFontColor(newFontColor);
      return;
    } else if (editor) {
      setFontColor(editor, newFontColor);
      setCurrentEditorFontColor(newFontColor);
    }
  }

  const setNewHighlightColor = (newHighlightColor = currentEditorHighlightColor) => {
    if (!editor) {
      window.alert("Please select text to highlight.");
      return;
    }
    setHighlightColor(editor, newHighlightColor);
    setCurrentEditorHighlightColor(newHighlightColor);
  }

  const handleSetAlignment = (editor, alignment) => {
    if (!editor && !activeSectionId) {
      dispatch(updateResumeStyling({ textAlign: alignment }));
      return;
    } else if (!editor && activeSectionId) {
      dispatch(updateSection({
        sectionId: activeSectionId,
        changes: { styling: { textAlign: alignment } }
      }));
      return;
    } else if (editor) {
      setAlignment(editor, alignment);
    }
  }

  return (

    <div className={styles.toolbarContainer}>
      {/* LINE HEIGHT */}
      <ToolbarButton
        text="-"
        command={() => setNewLineHeight('decrement')}
      />

      <ToolbarInput
        value={lineHeightInputValue}
        handleSetFontSizeInputValue={setLineHeightInputValue}
        handleSetNewFontSize={setNewLineHeight}
      />

      <ToolbarButton
        text="+"
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
        handleSetColor={setNewHighlightColor}
      />

      {/* SECTION BACKGROUND COLOR */}
      <ToolbarDropdown
        text="BC"
        handleSetColor={handleSetSectionBackgroundColor}
      />

      {/* FONT SIZE */}
      <ToolbarButton
        text="-"
        command={() => setNewFontSize('decrement')}
      />

      <ToolbarInput
        value={fontSizeInputValue}
        handleSetFontSizeInputValue={setFontSizeInputValue}
        handleSetNewFontSize={setNewFontSize}
      />

      <ToolbarButton
        text="+"
        command={() => setNewFontSize('increment')}
      />

      {/* INLINE TEXT FORMATTING */}
      <ToolbarButton
        text="B"
        styling={{ fontWeight: 'bold' }}
        command={() => editor && toggleMark(editor, "bold")}
      />
      <ToolbarButton
        text="I"
        styling={{ fontStyle: 'italic' }}
        command={() => editor && toggleMark(editor, "italic")}
      />
      <ToolbarButton
        text="U"
        styling={{ textDecoration: 'underline' }}
        command={() => editor && toggleMark(editor, "underline")}
      />
      <ToolbarButton
        text="S"
        styling={{ textDecoration: 'line-through' }}
        command={() => editor && toggleMark(editor, "strikeThrough")}
      />

      {/* TEXT ALIGNMENT */}
      <ToolbarButton
        text="L"
        command={() => handleSetAlignment(editor, 'left')}
        // command={() => editor && setAlignment(editor, "left")}
      />
      <ToolbarButton
        text="C"
        command={() => handleSetAlignment(editor, 'center')}
      />
      <ToolbarButton
        text="R"
        command={() => handleSetAlignment(editor, 'right')}
      />
      <ToolbarButton
        text="J"
        command={() => handleSetAlignment(editor, 'justify')}
      />

      {/* LISTS */}
      <ToolbarButton
        text="•"
        command={() => editor && toggleList(editor, "unordered-list")}
      />

      <ToolbarButton
        text="1."
        command={() => editor && toggleList(editor, "ordered-list")}
      />

      {/* CURRENTLY EDITING BUTTON */}
      <ToolbarButton
        text={`Currently Editing: ${currentlyEditingText}. Click to reset.`}
        command={() => clearToolbarSelection()}
      />

    </div>
  );
};

export default RichTextToolbar;