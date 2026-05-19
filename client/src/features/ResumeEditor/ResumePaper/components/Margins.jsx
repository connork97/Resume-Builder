import React, { useState } from 'react';

import styles from '../ResumePaper.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setResume, updateResume } from '@/store/resumeSlice';

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
      const name = e.currentTarget.dataset.name
      const parsedOldPaddingVal = parseFloat(resumePadding[name].replace('rem', '')).toFixed(1);
      let newPaddingVal = parsedOldPaddingVal;
      if (name === 'left' || name === 'right') {
         let adjustmentValue;

         if (e.key === "ArrowLeft") {
            if (name === 'left') adjustmentValue = -0.1;
            if (name === 'right') adjustmentValue = 0.1;
            console.log("Move left");
            newPaddingVal = parseFloat(newPaddingVal) + adjustmentValue;

            // newPaddingVal -= 0.1;
            console.log(parsedOldPaddingVal, newPaddingVal)
         }

         if (e.key === "ArrowRight") {
            if (name === 'left') adjustmentValue = 0.1;
            if (name === 'right') adjustmentValue = -0.1;
            console.log("Move right");
            newPaddingVal = parseFloat(newPaddingVal) + adjustmentValue;
            console.log(parsedOldPaddingVal, newPaddingVal)

         }
      }

      newPaddingVal = parseFloat(newPaddingVal).toFixed(1) + 'rem';
      dispatch(updateResume({
         key: 'layout',
         changes: {
            padding: {
               ...resumePadding,
               [name]: newPaddingVal
            }
         }
      }))
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
               data-name='left'
               data-value='left'
               className={styles.marginIndicatorLeft}
               style={{ marginLeft: resumePadding.left }}
               tabIndex={0}
               onClick={handleClick}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
            />
            <div
               data-name='right'
               data-value='right'
               className={styles.marginIndicatorRight}
               style={{ marginRight: resumePadding.right }}
               tabIndex={1}
               onClick={handleClick}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
            />
            {renderMarginRuler(8.5, 0.1, ['0'])}
         </div>

      </div>
   )
}