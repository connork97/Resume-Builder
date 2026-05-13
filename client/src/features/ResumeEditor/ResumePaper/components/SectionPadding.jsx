import React from 'react';

import { useSelector } from 'react-redux';

import styles from './Section.module.css';

const SectionPadding = ({ section, column }) => {
   const resume = useSelector(state => state.resume);
   const resumeLayout = resume.layout;
   console.log(section, column, resumeLayout)
   return (
      <div className={styles.sectionPaddingContainer}>
         <div className={styles.sectionPaddingTopWrapper}>
            Top
         </div>
         <div className={styles.sectionPaddingBottomWrapper}>
            Bottom
            <button
            >
               ^
            </button>
            <button
            >
               v
            </button>
         </div>
         <div className={styles.sectionPaddingLeftWrapper}>
            Left
         </div>
         <div className={styles.sectionPaddingRightWrapper}>
            Right
         </div>
      </div>
   )
}

export default SectionPadding;