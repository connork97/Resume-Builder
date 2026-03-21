import React from "react";

import { useSelector } from "react-redux";

import SlateWrapper from "../Slate/SlateWrapper";

import styles from "./Page.module.css";
import { resume } from "react-dom/server";

const Page = (props) => {
   const sections = useSelector((state) => state.resume.sections);
   const resumeStyling = useSelector((state) => state.resume.styling);
   const resumeLayout = useSelector((state) => state.resume.layout);

   if (resumeLayout.columns.count > 1) {
      const columns = Array.from({ length: resumeLayout.columns.count });
      console.log(columns)
      return (
         <div className={styles.pageContainerDiv} style={resumeStyling}>
            {columns.map((column, columnIndex) => {
               const columnStyling = {
                  width: resumeLayout.columns.width[columnIndex],
               }
               // padding: '0 0.5rem',
               return (
                  <div key={columnIndex} className={styles.columnWrapperDiv} style={columnStyling}>
                     {sections.map((section) => {
                        if (section.layout.columnIndex == columnIndex) {
                           return <SlateWrapper key={section.id} section={section} />
                        }

                     })}
                     {/* {sections.map((section, sectionIndex) => section.layout.columnIndex === columnIndex ? <SlateWrapper key={section.id} section={section} index={sectionIndex} /> : null)} */}
                  </div>
               )
            })}
         </div>
      )
   } else {

      // console.log(Object.keys(props.resumeStyling), Object.values(props.resumeStyling))
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