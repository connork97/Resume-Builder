import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '@/store/resumeSlice.js';
import { getActiveMark, setFontSize, setFontSizeOffset } from "@/helpers/marks.js";


import TextFormatButton from './shared/TextFormatButton';
import TextFormatInput from './shared/TextFormatInput';

// import styles from '../EditorToolbar/components/RichTextToolbar.module.css';
import styles from './TextFormatting.module.css';

const FontSize = ({ editor, selection, label }) => {

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
         dispatch(updateResume({
            key: 'styling',
            changes: {
               fontSize: `${resumeFontSize}px`
            }
         }))
         setFontSizeInputValue(resumeFontSize);
      } else if (!editor && activeSectionId) {
         const section = sections.byId[activeSectionId];
         // let sectionFontSize = parseInt(section.styling.fontSize || resumeStyling.fontSize);
         // sectionFontSize = findFontSizeValue(sectionFontSize, newFontSize);
         const currentSectionFontSizeOffset = section.styling.fontSizeOffset ?? 0;
         let newSectionFontSizeOffset = currentSectionFontSizeOffset;
         if (newFontSize === 'increment') {
            newSectionFontSizeOffset += 1;
         } else if (newFontSize === 'decrement') {
            newSectionFontSizeOffset -= 1;
         }
         dispatch(updateSection({
            id: activeSectionId,
            changes: { styling: { fontSizeOffset: newSectionFontSizeOffset } }
            // changes: { styling: { fontSize: `${sectionFontSize}px` } }
         }));
         // if (value === undefined || value === null) return fallback;

         const newSectionFontSize = Number(String(resumeStyling.fontSize).replace(/[^0-9.]/g, '')) + newSectionFontSizeOffset;

         // return Number.isNaN(number) ? fallback : number;
         setFontSizeInputValue(newSectionFontSize)
         // setFontSizeInputValue(sectionFontSize);
      }
      else if (editor) {
         const currentFontSizeOffset = getActiveMark(editor, 'fontSizeOffset');
         let newFontSizeOffset = currentFontSizeOffset;
         if (newFontSize === 'increment') {
            newFontSizeOffset += 1;
         } else if (newFontSize === 'decrement') {
            newFontSizeOffset -= 1;
         }

         setFontSizeOffset(editor, newFontSizeOffset);
         const newFontSizeInputValue = getActiveMark(editor, 'fontSize');
         setFontSizeInputValue(newFontSizeInputValue);
         // let currentFontSize = getActiveMark(editor, 'fontSize') || parseInt(fontSizeInputValue);
         // currentFontSize = findFontSizeValue(currentFontSize, newFontSize);
         // setFontSize(editor, `${currentFontSize}`);
         // setFontSizeInputValue(currentFontSize);
      }
   }

   return (
      <div className={styles.toolbarFlexWrapper}>
         <label className={styles.toolbarLabelSpan}>{label}:</label>
         <TextFormatButton
            text="-"
            command={() => setNewFontSize('decrement')}
         />

         <TextFormatInput
            value={fontSizeInputValue}
            handleChange={setFontSizeInputValue}
            commitChange={setNewFontSize}
         />

         <TextFormatButton
            text="+"
            command={() => setNewFontSize('increment')}
         />
      </div>
   )
}

export default FontSize;
