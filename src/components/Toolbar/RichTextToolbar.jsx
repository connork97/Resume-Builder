import React, { useState, useEffect } from "react";
import { Node } from "slate";
import { useSelector, useDispatch } from "react-redux";

import { setActiveEditorId, setActiveSectionId, updateResumeStyling, updateSection } from "../../store/resumeSlice.js";
import { toggleMark } from "../../helpers/marks.js";

import { editorRegistry } from '../../helpers/editorRegistry.js';

import ToolbarButton from "../Toolbar/ToolbarButton";
import LineHeight from '../Formatting/LineHeight.jsx';
import FontSize from '../Formatting/FontSize.jsx';
import FontColor from "../Formatting/FontColor.jsx";
import HighlightColor from "../Formatting/HighlightColor.jsx";
import BackgroundColor from "../Formatting/BackgroundColor.jsx";
import TextAlign from "../Formatting/TextAlign.jsx";
import Lists from "../Formatting/Lists.jsx";
import Marks from "../Formatting/Marks.jsx";
import Layout from "./Columns.jsx";

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
  const activeEditorLabel = editor?.children[0].label;

  const selection = useSelector(state => state.resume.activeEditorSelection);
  // const currentSelectionText = selection ? Node.string({ children: selection }) : null;

  useEffect(() => {
    if (!editor || !selection) {
      console.error('Editor is not ready.');
      return;
    }
    console.log('Editor is ready.')
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


  const clearToolbarSelection = () => {
    dispatch(setActiveEditorId(null));
    dispatch(setActiveSectionId(null));
  }


  return (

    <div className={styles.toolbarContainer}>
      <LineHeight
        editor={editor}
        selection={selection}
        dispatch={dispatch}
        sections={sections}
        activeSectionId={activeSectionId}
        resumeStyling={resumeStyling}
      />

      <FontColor
        editor={editor}
        selection={selection}
        dispatch={dispatch}
        activeSectionId={activeSectionId}
      />

      <HighlightColor
        editor={editor}
        selection={selection}
        dispatch={dispatch}
        activeSectionId={activeSectionId}
      />

      <BackgroundColor
        dispatch={dispatch}
        activeSectionId={activeSectionId}
      />

      <FontSize
        editor={editor}
        selection={selection}
        dispatch={dispatch}
        sections={sections}
        activeSectionId={activeSectionId}
        resumeStyling={resumeStyling}
      />

      <Marks editor={editor} />

      <TextAlign
        editor={editor}
        dispatch={dispatch}
        activeSectionId={activeSectionId}
      />

      <Lists editor={editor} />

      <Layout />

      {/* CURRENTLY EDITING BUTTON */}
      <ToolbarButton
        text={`Currently Editing: ${currentlyEditingText}. Click to reset.`}
        command={() => clearToolbarSelection()}
      />

    </div>
  );
};

export default RichTextToolbar;