import React, { useEffect, useState } from 'react';

import styles from '../ResumePaper.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setResume, updateColumn, updateResume } from '@/store/resumeSlice';

export const Margins = () => {

   const dispatch = useDispatch()

   const renderMarginLines = () => {
      for (let i = 0; i <= 8.5; i += 0.5) {
         return (
            <span className={styles.marginSpan}>{i}</span>
         )
      }
   }

   const resume = useSelector(state => state.resume);
   const resumePadding = resume?.layout?.padding;

   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);
   const sectionPadding = section?.layout?.padding;

   const columns = useSelector(state => state.resume.columns);
   const column = useSelector(state => state.resume.columns.byId[section?.columnId]);
   const columnPadding = column?.layout?.padding;

   const isFirstColumn = column?.id === columns?.allIds[0];
   const isLastColumn = column?.id === columns?.allIds[columns.allIds.length - 1];

   const getColumnWidths = (includeCurrent = false) => {
      let priorColumnWidths = 0;
      if (!column || !columns?.allIds) return 0;


      for (const columnId of columns.allIds) {
         if (String(columnId) === String(column.id) && !includeCurrent) {
            console.log('prior column widths: ', priorColumnWidths)

            return priorColumnWidths;
         }

         const widthValue = columns.byId[columnId]?.layout?.width?.value || "0%";
         const parsedColumnWidth = parseFloat(widthValue.replace("%", ""));

         priorColumnWidths += parsedColumnWidth;
      }
      console.log('prior column widths: ', priorColumnWidths)

      return priorColumnWidths;

   };

   const getSectionMargin = (name) => {

      let parsedColumnPadding = 0;
      let parsedSectionPadding = 0;


      if (columnPadding[name]) {
         console.log('column width: ', column.layout.width.value)
         console.log(columnPadding[name])
         parsedColumnPadding = parseFloat(columnPadding[name].replace('rem', '')).toFixed(1);
         console.log(parsedColumnPadding)
      }
      if (sectionPadding[name]) {
         parsedSectionPadding = parseFloat(sectionPadding[name].replace('rem', '')).toFixed(1);
         console.log(parsedSectionPadding)
      }

      const totalPadding = parsedColumnPadding + parsedSectionPadding + 'rem';
      console.log(totalPadding)
      return totalPadding;
   }


   const renderMarginRuler = (target, step, endsWith = []) => {
      const count = target / step + 1;

      return (
         Array.from(
            { length: count }, (_, index) => {
               const value = (index * step).toFixed(1);
               const displayValue = endsWith.includes(value.at(-1))
                  && value !== '0.0';
               return (
                  <span
                     className={
                        displayValue ? styles.marginSpan : styles.hiddenMarginSpan
                     }
                     value={value}
                  >
                     {displayValue
                        ? value.endsWith('.0')
                           ? value.slice(0, -2)
                           : value
                        : null}
                  </span>
               )
            }
         )
      );
   }


   const [isEditing, setIsEditing] = useState(false);

   const handleClick = (e) => {
      setIsEditing(true);
      console.log('editing')

      // Focus the div so it can receive keyboard events
      e.currentTarget.focus();
   };

   const handleKeyDown = (e) => {
      if (!isEditing) return;

      const { name, value } = e.currentTarget.dataset

      let parsedOldPaddingVal;
      let paddingToParse;
      if (name === 'resume') {
         paddingToParse = resumePadding;
      } else if (name === 'column') {
         paddingToParse = columnPadding;
      }
      parsedOldPaddingVal = parseFloat(paddingToParse[value].replace('rem', '')).toFixed(1);

      let newPaddingVal = parsedOldPaddingVal;

      if (value === 'left' || value === 'right') {
         let adjustmentValue = 0.1;

         if (e.key === "ArrowLeft") {
            if (value === 'left') adjustmentValue = -0.1;
            newPaddingVal = parseFloat(newPaddingVal) + adjustmentValue;
         }

         if (e.key === "ArrowRight") {
            if (value === 'right') adjustmentValue = -0.1;
            newPaddingVal = parseFloat(newPaddingVal) + adjustmentValue;
         }
      }

      newPaddingVal = parseFloat(newPaddingVal).toFixed(1) + 'rem';
      if (name === 'resume') {
         dispatch(updateResume({
            key: 'layout',
            changes: {
               padding: {
                  ...resumePadding,
                  [value]: newPaddingVal
               }
            }
         }))
      } else if (name === 'column') {
         dispatch(updateColumn({
            id: column.id,
            changes: {
               layout: {
                  padding: {
                     [value]: newPaddingVal
                  }
               }
            }
         }))
      }
      if (e.key === "Enter") {
         setIsEditing(false);
         e.currentTarget.blur();
      }
   };

   const handleBlur = () => {
      setIsEditing(false);
   };

   // console.log('RESUME PADDING: ', resumePadding)

   return (
      <div className={styles.marginsContainer}>
         <div className={styles.marginTopWrapper}>
            <div
               data-name='resume'
               data-value='left'
               className={styles.resumeMarginIndicatorLeft}
               style={{ marginLeft: resumePadding.left }}
               tabIndex={0}
               onClick={handleClick}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
            />
            <div
               data-name='resume'
               data-value='right'
               className={styles.resumeMarginIndicatorRight}
               style={{ marginRight: resumePadding.right }}
               tabIndex={0}
               onClick={handleClick}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
            />
            {column && !isFirstColumn &&
               <div
                  data-name='column'
                  data-value='left'
                  className={styles.sectionMarginIndicatorLeft}
                  style={{ marginLeft: `calc(${getColumnWidths(false)}% + ${getSectionMargin('left')})` }}
                  tabIndex={0}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
               />
            }
            {column && !isLastColumn &&
               <div
                  data-name='column'
                  data-value='right'
                  className={styles.sectionMarginIndicatorRight}
                  style={{ marginLeft: `calc(${column.layout.width.value} - ${column.layout.padding.right})` }}
                  tabIndex={0}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
               />
            }
            {renderMarginRuler(8.5, 0.1, ['0'])}
         </div>

      </div>
   )
}