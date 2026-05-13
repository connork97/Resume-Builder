import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateColumnPadding, updateSectionPadding } from '@/store/resumeSlice.js';

import styles from './Section.module.css';

const SectionPadding = ({ section, column, isFirstColumn, isLastColumn, isFirstRow, isLastRow }) => {

   const dispatch = useDispatch();

   const resume = useSelector(state => state.resume);
   const resumeLayout = resume.layout;

   const [sectionPadding, setSectionPadding] = useState({
      top: section?.layout?.padding?.top ?? column?.layout?.padding?.top ?? resumeLayout.padding.top,
      bottom: section?.layout?.padding?.bottom ?? column?.layout?.padding?.bottom ?? resumeLayout.padding.bottom,
      left: section?.layout?.padding?.left ?? column?.layout?.padding?.left ?? resumeLayout.padding.left,
      right: section?.layout?.padding?.right ?? column?.layout?.padding?.right ?? resumeLayout.padding.right
   })

   const handleSetPadding = (e) => {
      const { name, value } = e.target;
      let currentPaddingValue = sectionPadding[name];
      let parsedNewPaddingValue = parseFloat(currentPaddingValue.replace('rem', '')) + parseFloat(value)
      let newPaddingValueToString = String(parsedNewPaddingValue.toFixed(1)) + 'rem'
      console.log('CURRENT PADDING VALUE', newPaddingValueToString)
      if (parsedNewPaddingValue < 0) {
         alert('Padding cannot be negative for a section.')
         return;
      }

      if (name === 'top' || name === 'bottom') {
         dispatch(updateSectionPadding({
            id: section.id,
            padding: {
               [name]: newPaddingValueToString
            }
         }));
      } else if (name === 'left' || name === 'right') {
         console.log('COLUMN', column)
         dispatch(updateColumnPadding({
            id: column.id,
            padding: {
               [name]: newPaddingValueToString
            }
         }))
      }
      setSectionPadding(prevPadding => ({
         ...prevPadding,
         [name]: newPaddingValueToString
      }))
   }

   // console.log('SECTION', section, 'COLUMN', column, 'RESUME LAYOUT', resumeLayout)
   return (
      <div className={styles.sectionPaddingContainer}>
         <div className={styles.sectionPaddingTopWrapper}>
            Padding Top: {sectionPadding.top}
            <button
               className={styles.sectionPaddingButton}
               name='top'
               value='-0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               ^
            </button>
            <button
               className={styles.sectionPaddingButton}
               name='top'
               value='0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               v
            </button>         </div>
         <div className={styles.sectionPaddingBottomWrapper}>
            Padding Bottom: {sectionPadding.bottom}
            <button
               className={styles.sectionPaddingButton}
               name='bottom'
               value='-0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               ^
            </button>
            <button
               className={styles.sectionPaddingButton}
               name='bottom'
               value='0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               v
            </button>
         </div>
         {!isFirstColumn && (
            <div className={styles.sectionPaddingLeftWrapper}>
               Padding Left: {sectionPadding.left}
               <button
                  className={styles.sectionPaddingButton}
                  name='left'
               value='-0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               {'<'}
            </button>
            <button
               className={styles.sectionPaddingButton}
               name='left'
               value='0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               {'>'}
            </button>
         </div>
         )}
         {!isLastColumn && (
         <div className={styles.sectionPaddingRightWrapper}>
            Padding Right: {sectionPadding.right}
            <button
               className={styles.sectionPaddingButton}
               name='right'
               value='-0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               {'<'}
            </button>
            <button
               className={styles.sectionPaddingButton}
               name='right'
               value='0.1'
               onClick={(e) => handleSetPadding(e)}
            >
               {'>'}
            </button>
         </div>
)}
         {/* <div className={styles.sectionPaddingLeftWrapper}>
            Left
         </div>
         <div className={styles.sectionPaddingRightWrapper}>
            Right
         </div> */}
      </div>
   )
}

export default SectionPadding;