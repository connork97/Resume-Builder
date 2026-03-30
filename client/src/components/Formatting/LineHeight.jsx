import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';
import { getActiveMark, setLineHeight } from "../../helpers/marks.js";

import styles from '../Toolbar/RichTextToolbar.module.css';

import ToolbarButton from "../Toolbar/shared/ToolbarButton.jsx";
import ToolbarInput from "../Toolbar/shared/ToolbarInput.jsx";

const LineHeight = ({ editor, selection, label }) => {

   const dispatch = useDispatch();
   const sections = useSelector(state => state.resume.sections);
   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const resumeStyling = useSelector(state => state.resume.styling);

   const [lineHeightInputValue, setLineHeightInputValue] = useState(parseFloat(resumeStyling.lineHeight));

   useEffect(() => {
      if (!editor || !selection) return;
      const currentLineHeight = getActiveMark(editor, 'lineHeight');
      currentLineHeight && setLineHeightInputValue(currentLineHeight);
   }, [editor, selection])


   const findLineHeightValue = (lineHeightToChange, value) => {
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

   return (
      <div className={styles.toolBarButtonInputWrapper}>
         <span className={styles.toolbarLabelSpan}>{label}:</span>
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
      </div>
   )
}

export default LineHeight;