import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';
import { getActiveMark, setFontSize } from "../../helpers/marks.js";

import styles from '../Toolbar/RichTextToolbar.module.css';

import ToolbarButton from "../Toolbar/ToolbarButton.jsx";
import ToolbarInput from "../Toolbar/ToolbarInput.jsx";

const FontSize = ({ editor, selection }) => {

   const dispatch = useDispatch();
   const sections = useSelector(state => state.resume.sections);
   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const resumeStyling = useSelector(state => state.resume.styling);

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
      <div className={styles.toolBarButtonInputWrapper}>
         <ToolbarButton
            text="-"
            command={() => setNewFontSize('decrement')}
         />

         <ToolbarInput
            value={fontSizeInputValue}
            handleChange={setFontSizeInputValue}
            commitChange={setNewFontSize}
         />

         <ToolbarButton
            text="+"
            command={() => setNewFontSize('increment')}
         />
      </div>
   )
}

export default FontSize;
