import React, { useState } from 'react';

import styles from './MarginRuler.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateResume, updateSection } from '@/store/resumeSlice';

const MarginRulerSide = ({ renderMarginRuler }) => {

   const dispatch = useDispatch()

   const resume = useSelector(state => state.resume);
   const resumePadding = resume?.layout?.padding;

   const activeSectionId = useSelector(state => state.resume.activeSectionId);

   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);
   const sectionPadding = section?.layout?.padding;

   const column = useSelector(state => state.resume.columns.byId[section?.columnId]);
   const isFirstSectionInColumn = activeSectionId === column?.sectionIds[0];

   const [isEditing, setIsEditing] = useState(false);

   const handleClick = (e) => {
      setIsEditing(true);
      e.currentTarget.focus();
   };

   const handleKeyDown = (e) => {
      if (!isEditing || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
      e.preventDefault()

      console.log('keydown continued')

      const { name, value } = e.currentTarget.dataset;

      let parsedOldPaddingVal;
      let paddingToParse;

      if (name === 'resume') {
         paddingToParse = resumePadding;
      }  else if (name === 'section') {
         paddingToParse = sectionPadding;
      }

      console.log(paddingToParse)
      console.log(section.layout)

      const parsedPaddingVal = parseFloat(paddingToParse?.[value]);
      const defaultPaddingVal = parseFloat(resume?.layout?.gap?.vertical);
      parsedOldPaddingVal = Number.isNaN(parsedPaddingVal)
         ? defaultPaddingVal
         : parsedPaddingVal

      const adjustmentValue = e.key === 'ArrowUp' ? -0.1 : 0.1

      if (parseFloat(parsedOldPaddingVal + adjustmentValue).toFixed(1) < 0) {
         alert('Cannot have a negative margin.');
         return;
      }
      const newPaddingVal = (parsedOldPaddingVal + adjustmentValue).toFixed(1) + 'rem';

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

   const getSectionRect = (sectionId) => {
      const element = document.querySelector(`[data-section-id="${sectionId}"]`);

      if (!element) return null;

      return element.getBoundingClientRect();
   };

   const getIndicatorPosition = (topOrBottom) => {

      const columnSectionIds = column?.sectionIds;

      let total = 0;

      for (let id of columnSectionIds) {
         const sectionHeight = getSectionRect(id).height;
         if (topOrBottom === 'top') {
            if (id !== activeSectionId) {
               total += sectionHeight;
            } else {
               return total;
            }
         } else if (topOrBottom === 'bottom') {
            total += sectionHeight
            if (id === activeSectionId) {
               return total;
            }
         }
      }
      return total;
   }

   return (
      // <div className={styles.marginsContainer}>
         <div
            className={styles.marginRulerSideWrapper}
            data-prevent-blur={true}
         >
            {renderMarginRuler(11, 0.1, ['0'], 'bottom')}
            <div
               data-name='resume'
               data-value='top'
               className={styles.resumeMarginIndicatorTop}
               style={{ marginTop: resumePadding?.top }}
               tabIndex={0}
               onClick={handleClick}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
            />

            {section && !isFirstSectionInColumn &&
                  <div
                  data-name='section'
                  data-value='top'
                  className={styles.sectionMarginIndicatorTop}
                  style={{ marginTop: `calc(${getIndicatorPosition('top')}px)` }}
                  tabIndex={0}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  />
               }
            {section &&
                  <div
                     data-name='section'
                     data-value='bottom'
                     className={styles.sectionMarginIndicatorBottom}
                     style={{ marginTop: `calc(${getIndicatorPosition('bottom')}px)` }}
                     tabIndex={0}
                     onClick={handleClick}
                     onKeyDown={handleKeyDown}
                     onBlur={handleBlur}
                  />
            }
         </div>

      // </div>
   )
}

export default MarginRulerSide;
