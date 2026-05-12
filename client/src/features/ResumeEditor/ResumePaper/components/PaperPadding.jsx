import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../ResumePaper.module.css';
import { updateResumeLayout } from '@/store/resumeSlice';

const PaperPadding = () => {

   const dispatch = useDispatch();

   const resume = useSelector(state => state.resume);
   const resumeLayout = resume.layout;
   const padding = resume.layout.padding;
   console.log(padding)

   const changepadding = (e) => {
      const { name, value } = e.target;
      const currentPaddingValue = parseFloat(padding[name]);
      const paddingValueAdjustment = Number(value);

      dispatch(updateResumeLayout({
         changes: {
            padding: {
               ...padding,
               [name]: `${(currentPaddingValue + paddingValueAdjustment).toFixed(1)}rem`
            }
         }
      }))
   }

   return (
      <div className={styles.paddingContainer}>
         <div
            className={styles.paddingLeftWrapper}
            style={{ paddingLeft: padding.left }}
         >
            <span
               className={styles.paddingLeftSpan}
            >
               | Padding Left: {padding.left}
            </span>
            <button
               className={styles.paddingButton}
               name='left'
               value={-0.1}
               onClick={changepadding}
            >
               Left
            </button>
            <button
               className={styles.paddingButton}
               name='left'
               value={0.1}
               onClick={changepadding}
            >
               Right
            </button>
         </div>
         <div className={styles.paddingLeftMarker}></div>
         <div
            className={styles.paddingRightWrapper}
            style={{ paddingRight: padding.right }}
         >
            <button
               className={styles.paddingButton}
               name='right'
               value={0.1}
               onClick={changepadding}
            >
               Left
            </button>
            <button
               className={styles.paddingButton}
               name='right'
               value={-0.1}
               onClick={changepadding}
            >
               Right
            </button>
            <span
               className={styles.paddingRightSpan}
            >
               Padding Right: {padding.right} |
            </span>
         </div>
         <div
            className={styles.paddingTopWrapper}
            style={{ paddingTop: padding.top }}
         >
            <div className={styles.paddingButtonWrapper}>
               <button
                  className={styles.paddingButton}
                  name='top'
                  value={-0.1}
                  onClick={changepadding}
               >
                  Up
               </button>
               <button
                  className={styles.paddingButton}
                  name='top'
                  value={0.1}
                  onClick={changepadding}
               >
                  Down
               </button>
            </div>
            <span
               className={styles.paddingTopSpan}
            >
               Padding Top ￣￣￣
               <br></br>
               {padding.top}
            </span>
         </div>
         <div
            className={styles.paddingBottomWrapper}
            style={{ paddingBottom: padding.bottom }}
         >
            <div className={styles.paddingButtonWrapper}>
               <button
                  className={styles.paddingButton}
                  name='bottom'
                  value={0.1}
                  onClick={changepadding}
               >
                  Up
               </button>
               <button
                  className={styles.paddingButton}
                  name='bottom'
                  value={-0.1}
                  onClick={changepadding}
               >
                  Down
               </button>
            </div>
            <span
               className={styles.paddingBottomSpan}
            >
               Padding Bottom ___
               <br></br>
               {padding.bottom}
            </span>
         </div>
      </div>
   )
}

export default PaperPadding;