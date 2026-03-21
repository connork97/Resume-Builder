import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { updateSection } from "../../store/resumeSlice";

import Section from "../Section/Section.jsx";

import styles from "./Page.module.css";

const Page = () => {
   const sections = useSelector((state) => state.resume.sections);
   const resumeStyling = useSelector((state) => state.resume.styling);
   const resumeLayout = useSelector((state) => state.resume.layout);
   const resumeColumnCount = resumeLayout.columns.count;

   const dispatch = useDispatch();

   const handleFixInvalidColumnIndex = (sectionId) => {
      dispatch(updateSection({ sectionId, changes: { layout: { columnIndex: 0 } } }));
   }

   // Handle how many columns to render on the page based on resume layout settings.
   const renderColumns = () => {
      if (resumeColumnCount) {
         const columns = Array.from({ length: resumeColumnCount });
         return columns.map((_, columnIndex) => {
            const columnStyling = {
               width: resumeLayout.columns.width[columnIndex],
            }
            return (
               <div key={columnIndex} className={styles.columnWrapperDiv} style={columnStyling}>
                  {sections.map((section, sectionIndex) => {
                     // If the section has a column index that matches the current column index, render it in the column.
                     // OR, if the section doesn't have a valid column index, render it in the first column.
                     let sectionColumnIndex = section.layout.columnIndex;
                     const maxValidColumnIndex = resumeColumnCount - 1;

                     if (!sectionColumnIndex || sectionColumnIndex > maxValidColumnIndex) {
                        sectionColumnIndex = 0;
                     }

                     if (sectionColumnIndex == columnIndex) {
                        return <Section key={section.id} section={section} index={sectionIndex} />
                     }
                  }
                  )}
               </div>
            )
         })
      } else {
         return <h2>No columns to display.</h2>
      }
   }

   return (
      <div className={styles.pageContainerDiv} style={resumeStyling}>
         {renderColumns()}
      </div>
   )
}

export default Page;