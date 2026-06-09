import React, { useEffect, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '@/store/resumeSlice.js';
import { getActiveMark, setLineHeightOffset } from '@/helpers/marks.js';
import { getCascadedLineHeight, getNumber, roundToTenth } from '@/helpers/leafHelpers.js';

import TextFormatButton from './shared/TextFormatButton';
import TextFormatInput from './shared/TextFormatInput';

import styles from './TextFormatting.module.css';

/* eslint-disable react-hooks/set-state-in-effect */

const LINE_HEIGHT_STEP = 0.1;

const parseLineHeight = (value, fallback = null) => {
   const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
   return Number.isNaN(parsed) ? fallback : parsed;
};

const LineHeight = ({
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
   resumeStyling,
}) => {

   const dispatch = useDispatch();
   const reduxSections = useSelector(state => state.resume.sections);

   const getResumeLineHeight = useCallback(
      () => roundToTenth(getNumber(resumeStyling?.lineHeight, 1.2)),
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
      return column ?? columns?.byId?.[sectionData.columnId];
   }, [column, columns, getSection]);

   const [lineHeightInputValue, setLineHeightInputValue] = useState(getResumeLineHeight());

   useEffect(() => {
      if (editor && selection && activeEditorId && fields) {
         const field = fields.byId[activeEditorId];
         if (field) {
            const subsection = subsections.byId[field.subsectionId];
            const sectionData = subsection ? reduxSections.byId[subsection.sectionId] : null;
            const columnData = sectionData ? columns.byId[sectionData.columnId] : null;

            if (subsection && sectionData) {
               const leafStyling = {
                  lineHeightOffset: getActiveMark(editor, 'lineHeightOffset') ?? 0,
               };
               const totalLineHeight = getCascadedLineHeight({
                  resumeStyling,
                  columnStyling: columnData?.styling,
                  sectionStyling: sectionData?.styling,
                  subsectionStyling: subsection?.styling,
                  fieldStyling: field?.styling,
                  leafStyling,
               });
               setLineHeightInputValue(totalLineHeight);
               return;
            }
         }
      }

      if (editor && selection && activeEditorId && !fields?.byId?.[activeEditorId]) {
         const headingSection = reduxSections.byId[activeEditorId];
         if (headingSection) {
            const columnData = columns.byId[headingSection.columnId];
            const leafStyling = {
               lineHeightOffset: getActiveMark(editor, 'lineHeightOffset') ?? 0,
            };
            const totalLineHeight = getCascadedLineHeight({
               resumeStyling,
               columnStyling: columnData?.styling,
               sectionStyling: headingSection?.styling,
               leafStyling,
            });
            setLineHeightInputValue(totalLineHeight);
            return;
         }
      }

      if (effectiveSectionId && !editor) {
         const sectionData = getSection();
         const columnData = getColumn();
         const totalLineHeight = getCascadedLineHeight({
            resumeStyling,
            columnStyling: columnData?.styling,
            sectionStyling: sectionData?.styling,
         });
         setLineHeightInputValue(totalLineHeight);
         return;
      }

      setLineHeightInputValue(getResumeLineHeight());
   }, [editor, selection, activeEditorId, effectiveSectionId, getSection, getColumn, getResumeLineHeight, resumeStyling, reduxSections, columns, fields, subsections]);

   const getTargetLineHeight = (newLineHeight) => {
      const currentValue = parseLineHeight(lineHeightInputValue, getResumeLineHeight());

      if (newLineHeight === 'increment') {
         return roundToTenth(currentValue + LINE_HEIGHT_STEP);
      }

      if (newLineHeight === 'decrement') {
         return roundToTenth(currentValue - LINE_HEIGHT_STEP);
      }

      return roundToTenth(parseLineHeight(newLineHeight, currentValue));
   };

   const activeSectionIds = useSelector(state => state.resume.adctiveSectionIds);

   const setNewLineHeight = (newLineHeight = lineHeightInputValue) => {
      const targetLineHeight = getTargetLineHeight(newLineHeight);
      if (targetLineHeight <= 0) return;
      
      const sectionIdToUse = effectiveSectionId;



      if (editor && activeEditorId && fields) {
         const field = fields.byId[activeEditorId];
         if (field) {
            const subsection = subsections.byId[field.subsectionId];
            const sectionData = subsection ? reduxSections.byId[subsection.sectionId] : null;
            const columnData = sectionData ? columns.byId[sectionData.columnId] : null;

            if (subsection && sectionData) {
               const inheritedLineHeight = getCascadedLineHeight({
                  resumeStyling,
                  columnStyling: columnData?.styling,
                  sectionStyling: sectionData?.styling,
                  subsectionStyling: subsection?.styling,
                  fieldStyling: field?.styling,
               });

               if (newLineHeight === 'increment' || newLineHeight === 'decrement') {
                  const currentLeafOffset = getNumber(getActiveMark(editor, 'lineHeightOffset'), 0);
                  const offsetChange = newLineHeight === 'increment' ? LINE_HEIGHT_STEP : -LINE_HEIGHT_STEP;
                  setLineHeightOffset(editor, roundToTenth(currentLeafOffset + offsetChange));
               } else {
                  setLineHeightOffset(editor, roundToTenth(targetLineHeight - inheritedLineHeight));
               }

               setLineHeightInputValue(targetLineHeight);
               return;
            }
         }
      }

      if (editor && activeEditorId && !fields?.byId?.[activeEditorId]) {
         const headingSection = reduxSections.byId[activeEditorId];
         if (headingSection) {
            const columnData = columns.byId[headingSection.columnId];
            const inheritedLineHeight = getCascadedLineHeight({
               resumeStyling,
               columnStyling: columnData?.styling,
               sectionStyling: headingSection?.styling,
            });

            if (newLineHeight === 'increment' || newLineHeight === 'decrement') {
               const currentLeafOffset = getNumber(getActiveMark(editor, 'lineHeightOffset'), 0);
               const offsetChange = newLineHeight === 'increment' ? LINE_HEIGHT_STEP : -LINE_HEIGHT_STEP;
               setLineHeightOffset(editor, roundToTenth(currentLeafOffset + offsetChange));
            } else {
               setLineHeightOffset(editor, roundToTenth(targetLineHeight - inheritedLineHeight));
            }

            setLineHeightInputValue(targetLineHeight);
            return;
         }
      }

      if (!editor && sectionIdToUse && !(activeSectionIds.length > 0)) {
         const sectionData = getSection();
         if (!sectionData) return;

         const inheritedLineHeight = getCascadedLineHeight({
            resumeStyling,
            columnStyling: getColumn()?.styling,
         });
         const newSectionLineHeightOffset = roundToTenth(targetLineHeight - inheritedLineHeight);

         dispatch(updateSection({
            id: sectionIdToUse,
            changes: { styling: { lineHeightOffset: newSectionLineHeightOffset } }
         }));
         setLineHeightInputValue(targetLineHeight);
      } else if (!editor && !sectionIdToUse) {
         dispatch(updateResume({
            key: 'styling',
            changes: {
               lineHeight: targetLineHeight,
            }
         }));
         setLineHeightInputValue(targetLineHeight);
      }
   };

   return (
      <div className={styles.toolbarFlexWrapper}>
         <label className={styles.toolbarLabel}>{label}:</label>
         <TextFormatButton
            text="-"
            command={() => setNewLineHeight('decrement')}
         />

         <TextFormatInput
            value={lineHeightInputValue}
            handleChange={setLineHeightInputValue}
            commitChange={() => setNewLineHeight(lineHeightInputValue)}
         />

         <TextFormatButton
            text="+"
            command={() => setNewLineHeight('increment')}
         />
      </div>
   );
};

export default LineHeight;
