import React, { useState } from 'react';

import styles from './MarginRuler.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateColumn, updateResume, updateSection } from '@/store/resumeSlice';

const MarginRulerTop = ({ renderMarginRuler }) => {

   const dispatch = useDispatch()

   const resume = useSelector(state => state.resume);
   const resumePadding = resume?.layout?.padding ?? {};

   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);
   const sectionPadding = section?.layout?.padding ?? {};

   const columns = useSelector(state => state.resume.columns);
   const column = useSelector(state => state.resume.columns.byId[section?.columnId]);
   const columnPadding = column?.layout?.padding ?? {};

   const isFirstColumn = column?.id === columns?.allIds[0];
   const isLastColumn = column?.id === columns?.allIds[columns.allIds.length - 1];

   const parseRemValue = (value) => {
      const parsedValue = parseFloat(String(value ?? '0rem').replace('rem', ''));
      return Number.isNaN(parsedValue) ? 0 : parsedValue;
   };


   const getColumnWidths = (includeCurrent = false) => {
      let priorColumnWidths = 0;
      if (!column || !columns?.allIds) return 0;


      for (const columnId of columns.allIds) {
         if (String(columnId) === String(column.id) && !includeCurrent) {
            // console.log('prior column widths: ', priorColumnWidths)

            return priorColumnWidths;
         }

         const widthValue = columns.byId[columnId]?.layout?.width?.value || "0%";
         const parsedColumnWidth = parseFloat(widthValue.replace("%", ""));

         priorColumnWidths += parsedColumnWidth;
      }
      // console.log('prior column widths: ', priorColumnWidths)

      return priorColumnWidths;

   };

   const getSectionMargin = (name) => {

      const parsedColumnPadding = parseRemValue(columnPadding?.[name]);
      const parsedSectionPadding = parseRemValue(sectionPadding?.[name]);

      return `${(parsedColumnPadding + parsedSectionPadding).toFixed(1)}rem`;
   }




   const [isEditing, setIsEditing] = useState(false);

   const handleClick = (e) => {
      setIsEditing(true);
      e.currentTarget.focus();
   };

   const handleKeyDown = (e) => {
      if (!isEditing || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;

      const { name, value } = e.currentTarget.dataset;

      let parsedOldPaddingVal;
      let paddingToParse;

      if (name === 'resume') {
         paddingToParse = resumePadding;
      } else if (name === 'column') {
         paddingToParse = columnPadding;
      } else if (name === 'section') {
         paddingToParse = sectionPadding;
      }

      parsedOldPaddingVal = parseRemValue(paddingToParse?.[value]).toFixed(1);
      let newPaddingVal = parsedOldPaddingVal;

      let adjustmentValue = 0.1;

      if (e.key === "ArrowLeft" && value === 'left') adjustmentValue = -0.1;
      if (e.key === "ArrowRight" && value === 'right') adjustmentValue = -0.1;

      newPaddingVal = parseFloat(newPaddingVal) + adjustmentValue;
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
      } else if (name === 'section') {
         dispatch(updateSection({
            id: section.id,
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


   return (
      <div
         className={styles.marginRulerTopWrapper}
         data-prevent-blur={true}
      >
         <div
            data-name='resume'
            data-value='left'
            className={styles.resumeMarginIndicatorLeft}
            style={{ marginLeft: resumePadding.left ?? '0rem' }}
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
         />
         <div
            data-name='resume'
            data-value='right'
            className={styles.resumeMarginIndicatorRight}
            style={{ marginRight: resumePadding.right ?? '0rem' }}
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
               style={{ marginLeft: `calc(${column.layout?.width?.value ?? '0%'} - ${columnPadding.right ?? '0rem'})` }}
               tabIndex={0}
               onClick={handleClick}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
            />
         }
         {renderMarginRuler(8.5, 0.1, ['0'], 'top')}
      </div>
   )
}

export default MarginRulerTop;
