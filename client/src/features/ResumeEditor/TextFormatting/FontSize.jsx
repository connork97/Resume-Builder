import React, { useEffect, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '@/store/resumeSlice.js';
import { getActiveMark, setFontSizeOffset } from "@/helpers/marks.js";

import TextFormatButton from './shared/TextFormatButton';
import TextFormatInput from './shared/TextFormatInput';

// import styles from '../EditorToolbar/components/RichTextToolbar.module.css';
import styles from './TextFormatting.module.css';

/* eslint-disable react-hooks/set-state-in-effect */

const FontSize = ({
   editor,
   selection,
   section,
   column,
   label,
   columns,
   fields,
   subsections,
   activeSectionId,
   activeEditorId,
   resumeStyling
}) => {

   const dispatch = useDispatch();
   const reduxSections = useSelector(state => state.resume.sections);
   const activeSectionIds = useSelector(state => state.resume.activeSectionIds);

   const getNumericFontSize = (value, fallback = 12) => {
      const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
      return Number.isNaN(parsed) ? fallback : parsed;
   }

   const getResumeFontSize = useCallback(
      () => getNumericFontSize(resumeStyling.fontSize),
      [resumeStyling]
   );
   const effectiveSectionId = section?.id ?? activeSectionId;
   const getSection = useCallback(
      () => section ?? reduxSections.byId[effectiveSectionId],
      [section, reduxSections, effectiveSectionId]
   );
   const getColumn = useCallback(() => {
      const sectionData = getSection();
      if (!sectionData) return null;
      return column ?? columns.byId[sectionData.columnId];
   }, [column, columns, getSection]);
   const getSectionTotalFontSize = useCallback((sectionData) => {
      if (!sectionData) return getResumeFontSize();

      const columnData = columns.byId[sectionData.columnId];
      const baseFontSize = getResumeFontSize();
      const columnFontSizeOffset = columnData?.styling?.fontSizeOffset ?? 0;
      const sectionFontSizeOffset = sectionData?.styling?.fontSizeOffset ?? 0;

      return baseFontSize + columnFontSizeOffset + sectionFontSizeOffset;
   }, [columns, getResumeFontSize]);

   const [fontSizeInputValue, setFontSizeInputValue] = useState(getResumeFontSize());

   useEffect(() => {
      // Case 1: Editing field in rich text editor
      if (editor && selection && activeEditorId && fields) {
         const field = fields.byId[activeEditorId];
         if (field) {
            // Look up the hierarchy: field > subsection > section > column
            const subsection = subsections.byId[field.subsectionId];
            if (subsection) {
               const sectionData = reduxSections.byId[subsection.sectionId];
               if (sectionData) {
                  const columnData = columns.byId[sectionData.columnId];
                  const baseFontSize = getResumeFontSize();
                  const columnFontSizeOffset = columnData?.styling?.fontSizeOffset ?? 0;
                  const sectionFontSizeOffset = sectionData?.styling?.fontSizeOffset ?? 0;
                  const subsectionFontSizeOffset = subsection?.styling?.fontSizeOffset ?? 0;
                  const fieldFontSizeOffset = field?.styling?.fontSizeOffset ?? 0;
                  const leafFontSizeOffset = getActiveMark(editor, 'fontSizeOffset') ?? 0;
                  const totalSize = baseFontSize + columnFontSizeOffset + sectionFontSizeOffset + subsectionFontSizeOffset + fieldFontSizeOffset + leafFontSizeOffset;
                  setFontSizeInputValue(totalSize);
                  return;
               }
            }
         }
      }

      // Case 1b: Editing a section heading editor
      if (editor && selection && activeEditorId && !fields?.byId?.[activeEditorId]) {
         const headingSection = reduxSections.byId[activeEditorId];
         if (headingSection) {
            const columnData = columns.byId[headingSection.columnId];
            const baseFontSize = getResumeFontSize();
            const columnFontSizeOffset = columnData?.styling?.fontSizeOffset ?? 0;
            const sectionFontSizeOffset = headingSection?.styling?.fontSizeOffset ?? 0;
            const leafFontSizeOffset = getActiveMark(editor, 'fontSizeOffset') ?? 0;
            const totalSize = baseFontSize + columnFontSizeOffset + sectionFontSizeOffset + leafFontSizeOffset;
            setFontSizeInputValue(totalSize);
            return;
         }
      }

      // Case 2: Multiple sections selected
      if (activeSectionIds.length > 0 && !editor) {
         const firstActiveSection = reduxSections.byId[activeSectionIds[0]];
         setFontSizeInputValue(getSectionTotalFontSize(firstActiveSection));
         return;
      }

      // Case 3: Section selected (no editor active)
      if (effectiveSectionId && !editor) {
         const sectionData = getSection();
         setFontSizeInputValue(getSectionTotalFontSize(sectionData));
         return;
      }

      // Case 4: Default - resume only
      setFontSizeInputValue(getResumeFontSize());
   }, [editor, selection, activeEditorId, effectiveSectionId, activeSectionIds, getSection, getSectionTotalFontSize, getResumeFontSize, resumeStyling, reduxSections, columns, fields, subsections]);

   const setNewFontSize = (newFontSize) => {
      const parsedFontSize = (value) => {
         const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
         return Number.isNaN(parsed) ? null : parsed;
      };

      const currentValue = parsedFontSize(fontSizeInputValue) ?? getResumeFontSize();
      let targetFontSize = currentValue;

      if (newFontSize === 'increment') {
         targetFontSize = currentValue + 1;
      } else if (newFontSize === 'decrement') {
         targetFontSize = currentValue - 1;
      } else {
         const parsedTarget = parsedFontSize(newFontSize);
         if (parsedTarget !== null) {
            targetFontSize = parsedTarget;
         }
      }

      if (targetFontSize <= 0) return;

      const sectionIdToUse = effectiveSectionId;

      // Case 0: Multiple sections selected
      if (activeSectionIds.length > 0) {
         activeSectionIds.forEach((sectionId) => {
            const sectionData = reduxSections.byId[sectionId];
            if (!sectionData) return;

            const columnData = columns.byId[sectionData.columnId];
            const baseFontSize = getResumeFontSize();
            const columnFontSizeOffset = columnData?.styling?.fontSizeOffset ?? 0;
            const currentSectionFontSizeOffset = sectionData?.styling?.fontSizeOffset ?? 0;
            let newSectionFontSizeOffset = currentSectionFontSizeOffset;

            if (newFontSize === 'increment') {
               newSectionFontSizeOffset += 1;
            } else if (newFontSize === 'decrement') {
               newSectionFontSizeOffset -= 1;
            } else {
               newSectionFontSizeOffset = targetFontSize - baseFontSize - columnFontSizeOffset;
            }

            dispatch(updateSection({
               id: sectionId,
               changes: { styling: { fontSizeOffset: newSectionFontSizeOffset } }
            }));
         });

         setFontSizeInputValue(targetFontSize);
         return;
      }

      // Case 1: Editing in field (editor active)
      if (editor && activeEditorId && fields) {
         const field = fields.byId[activeEditorId];
         if (field) {
            const subsection = subsections.byId[field.subsectionId];
            if (subsection) {
               const sectionData = reduxSections.byId[subsection.sectionId];
               if (sectionData) {
                  const columnData = columns.byId[sectionData.columnId];
                  const baseFontSize = getResumeFontSize();
                  const columnFontSizeOffset = columnData?.styling?.fontSizeOffset ?? 0;
                  const sectionFontSizeOffset = sectionData?.styling?.fontSizeOffset ?? 0;
                  const subsectionFontSizeOffset = subsection?.styling?.fontSizeOffset ?? 0;
                  const fieldFontSizeOffset = field?.styling?.fontSizeOffset ?? 0;

                  // When incrementing/decrementing, update the leaf mark offset
                  if (newFontSize === 'increment' || newFontSize === 'decrement') {
                     const currentLeafOffset = getActiveMark(editor, 'fontSizeOffset') ?? 0;
                     let newLeafOffset = currentLeafOffset;
                     if (newFontSize === 'increment') {
                        newLeafOffset += 1;
                     } else {
                        newLeafOffset -= 1;
                     }
                     setFontSizeOffset(editor, newLeafOffset);
                  } else {
                     // Direct value set: compute required leaf offset to reach target
                     const calculatedLeafOffset = targetFontSize - baseFontSize - columnFontSizeOffset - sectionFontSizeOffset - subsectionFontSizeOffset - fieldFontSizeOffset;
                     setFontSizeOffset(editor, calculatedLeafOffset);
                  }
                  setFontSizeInputValue(targetFontSize);
                  return;
               }
            }
         }
      }

      // Case 1b: Editing a section heading editor
      if (editor && activeEditorId && !fields?.byId?.[activeEditorId]) {
         const headingSection = reduxSections.byId[activeEditorId];
         if (headingSection) {
            const columnData = columns.byId[headingSection.columnId];
            const baseFontSize = getResumeFontSize();
            const columnFontSizeOffset = columnData?.styling?.fontSizeOffset ?? 0;
            const sectionFontSizeOffset = headingSection?.styling?.fontSizeOffset ?? 0;
            
            if (newFontSize === 'increment' || newFontSize === 'decrement') {
               const currentLeafOffset = getActiveMark(editor, 'fontSizeOffset') ?? 0;
               let newLeafOffset = currentLeafOffset;
               if (newFontSize === 'increment') {
                  newLeafOffset += 1;
               } else {
                  newLeafOffset -= 1;
               }
               setFontSizeOffset(editor, newLeafOffset);
            } else {
               const calculatedLeafOffset = targetFontSize - baseFontSize - columnFontSizeOffset - sectionFontSizeOffset;
               setFontSizeOffset(editor, calculatedLeafOffset);
            }
            setFontSizeInputValue(targetFontSize);
            return;
         }
      }

      // Case 2: Section selected (no editor)
      if (!editor && sectionIdToUse) {
         const sectionData = getSection();
         if (!sectionData) return;

         const baseFontSize = getResumeFontSize();
         const columnFontSizeOffset = getColumn()?.styling?.fontSizeOffset ?? 0;
         const newSectionFontSizeOffset = targetFontSize - baseFontSize - columnFontSizeOffset;

         dispatch(updateSection({
            id: sectionIdToUse,
            changes: { styling: { fontSizeOffset: newSectionFontSizeOffset } }
         }));
         setFontSizeInputValue(targetFontSize);
      }
      // Case 3: Resume level (no editor, no section)
      else if (!editor && !sectionIdToUse) {
         dispatch(updateResume({
            key: 'styling',
            changes: {
               fontSize: `${targetFontSize}px`
            }
         }));
         setFontSizeInputValue(targetFontSize);
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
            commitChange={() => setNewFontSize(fontSizeInputValue)}
         />

         <TextFormatButton
            text="+"
            command={() => setNewFontSize('increment')}
         />
      </div>
   )
}

export default FontSize;
