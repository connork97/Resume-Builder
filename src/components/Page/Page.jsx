import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { updateSection } from "../../store/resumeSlice";

import Section from "../Section/Section.jsx";
import Column from "./Column.jsx";

import styles from "./Page.module.css";

const Page = () => {
   const sections = useSelector((state) => state.resume.sections);
   const resumeStyling = useSelector((state) => state.resume.styling);
   // const resumeLayout = useSelector((state) => state.resume.layout);
   const columns = useSelector((state) => state.resume.columns);

   const dispatch = useDispatch();

   const handleFixInvalidColumnIndex = (sectionId) => {
      dispatch(updateSection({ sectionId, changes: { layout: { columnIndex: 0 } } }));
   }

   // Handle which sections to render within each column


   // Handle how many columns to render on the page based on resume layout settings.
   const renderedColumns = columns.allIds?.map((columnId) => {
      // if (!allColumnIds.length) return <h2>No columns to display.</h2>;

      // return allColumnIds.map((columnId) => {
         const column = columns.byId[columnId];
         if (!column) {
            console.error(`Column with ID ${columnId} not found.`);
            return null;
         }

         return <Column key={column.id} column={column} />
         {/* {sections.map((section, sectionIndex) => {
               // If the section has a column index that matches the current column index, render it in the column.
               // OR, if the section doesn't have a valid column index, render it in the first column.
                     let sectionColumnIndex = section.layout.columnIndex;
                     const maxValidColumnIndex = resumeColumnCount - 1;

                     if (!sectionColumnIndex || sectionColumnIndex > maxValidColumnIndex) {
                        sectionColumnIndex = 0;
                        }
                        
                        if (sectionColumnIndex == columnIndex) {
                        return (
                           <Section
                           key={section.id}
                              section={section}
                              index={sectionIndex}
                              // columnIndex={columnIndex}
                              />
                        )
                        }
                  }
                  )} */}
      // })
   });


   return (
      <div className={styles.pageContainerDiv} style={{ ...resumeStyling }}>
         {renderedColumns}
         {/* {columns.allIds.map((columnId) => <Column key={columnId} column={columns.byId[columnId]} />)} */}
      </div>
   )
}

export default Page;