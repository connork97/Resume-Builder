import React, { useEffect, useState } from 'react';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';
import { getActiveMark, setLineHeight } from "../Slate/helpers/marks.js";

import ToolbarButton from "../Toolbar/ToolbarButton";
import ToolbarInput from "./ToolbarInput.jsx";

const LineHeight = ({ editor, selection, dispatch, sections, activeSectionId, resumeStyling }) => {

   const [lineHeightInputValue, setLineHeightInputValue] = useState(parseFloat(resumeStyling.lineHeight));

   useEffect(() => {
      if (!editor || !selection) return;
      const currentLineHeight = getActiveMark(editor, 'lineHeight');
      currentLineHeight && setLineHeightInputValue(currentLineHeight);
   }, [editor, selection])


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

   return (
      <>
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
      </>
   )
}

export default LineHeight;