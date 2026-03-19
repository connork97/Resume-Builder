import React, { useEffect, useState } from 'react';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';
import { getActiveMark, setFontSize } from "../Slate/helpers/marks.js";

import ToolbarButton from "../Toolbar/ToolbarButton";
import ToolbarInput from "./ToolbarInput.jsx";

const FontSize = ({ editor, selection, dispatch, sections, activeSectionId, resumeStyling }) => {
   const [fontSizeInputValue, setFontSizeInputValue] = useState(parseInt(resumeStyling.fontSize));

   useEffect(() => {
      if (!editor || !selection) return;
      const currentFontSize = getActiveMark(editor, 'fontSize');
      currentFontSize && setFontSizeInputValue(parseInt(currentFontSize));
   }, [editor, selection])

   const findFontSizeValue = (fontSizeToChange, value) => {
      fontSizeToChange = parseInt(fontSizeToChange);
      if (value === 'increment') {
         fontSizeToChange += 1;
      } else if (value === 'decrement') {
         fontSizeToChange -= 1;
      } else {
         fontSizeToChange = parseInt(fontSizeInputValue);
      }
      return fontSizeToChange;
   }

   const setNewFontSize = (newFontSize = fontSizeInputValue) => {
      if (!editor && !activeSectionId) {
         let resumeFontSize = parseInt(resumeStyling.fontSize);
         resumeFontSize = findFontSizeValue(resumeFontSize, newFontSize);
         dispatch(updateResumeStyling({ fontSize: `${resumeFontSize}px` }));
         setFontSizeInputValue(resumeFontSize);
      } else if (!editor && activeSectionId) {
         const section = sections.find(s => s.id === activeSectionId);
         let sectionFontSize = parseInt(section.styling.fontSize || resumeStyling.fontSize);
         sectionFontSize = findFontSizeValue(sectionFontSize, newFontSize);
         dispatch(updateSection({
            sectionId: activeSectionId,
            changes: { styling: { fontSize: `${sectionFontSize}px` } }
         }));
         setFontSizeInputValue(sectionFontSize);
      }
      else if (editor) {
         let currentFontSize = getActiveMark(editor, 'fontSize') || parseInt(fontSizeInputValue);
         currentFontSize = findFontSizeValue(currentFontSize, newFontSize);
         setFontSize(editor, `${currentFontSize}`);
         setFontSizeInputValue(currentFontSize);
      }
   }

   return (
      <>
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
      </>
   )
}

export default FontSize;
