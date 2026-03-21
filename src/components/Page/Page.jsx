import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { updateSection } from "../../store/resumeSlice";

import SlateWrapper from "../Section/Section";

import styles from "./Page.module.css";

const Page = (props) => {
   const sections = useSelector((state) => state.resume.sections);
   const resumeStyling = useSelector((state) => state.resume.styling);
   const resumeLayout = useSelector((state) => state.resume.layout);

   const dispatch = useDispatch();

   if (resumeLayout.columns.count > 1) {
      const columns = Array.from({ length: resumeLayout.columns.count });
      console.log(columns)
      return (
         <div className={styles.pageContainerDiv} style={resumeStyling}>
            {columns.map((column, columnIndex) => {
               const columnStyling = {
                  width: resumeLayout.columns.width[columnIndex],
               }
               return (
                  <div key={columnIndex} className={styles.columnWrapperDiv} style={columnStyling}>
                     {sections.map((section) => {
                        if (
                           (section.layout.columnIndex == columnIndex)
                           || (columnIndex === 0
                              && (!section.layout.columnIndex || section.layout.columnIndex >= resumeLayout.columns.count)
                           )) {
                              // dispatch(updateSection({
                              //    sectionId: section.id,
                              //    changes: {
                              //       layout: {
                              //          columnIndex: columnIndex,
                              //       }
                              //    }
                              // }))
                           return <SlateWrapper key={section.id} section={section} />
                        }
                     })}
                  </div>
               )
            })}
         </div>
      )
   } else {

      return (
         <div className={styles.pageContainerDiv} style={resumeStyling}>
            {sections.map((section, index) => {
               return <SlateWrapper key={section.id} section={section} index={index} />
            }
            )}
         </div>
      );
   }
}

export default Page;