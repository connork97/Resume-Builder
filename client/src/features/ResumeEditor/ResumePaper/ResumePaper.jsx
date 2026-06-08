import React, { forwardRef } from "react";

import { useSelector } from "react-redux";

import Column from "./components/Column.jsx";

import styles from "./ResumePaper.module.css";

const ResumePaper = forwardRef(function ResumePaper(props, ref) {
   // const ResumePaper = (props) => {

   const resumeStyling = useSelector((state) => state.resume.styling);
   const columns = useSelector((state) => state.resume.columns);

   // Handle how many columns to render on the page based on resume layout settings.
   const renderedColumns = columns.allIds?.map((columnId) => {
      const column = columns.byId[columnId];
      if (!column) {
         console.error(`Column with ID ${columnId} not found.`);
         return null;
      }

      return <Column key={column.id} column={column} />
   });
   
   return (
      <div
         className={styles.printPageRef}
         ref={ref}
      >
         <div
            className={`${props.isPrinting ? styles.editingPageContainer : styles.printingPageContainer}`}
            style={{ ...resumeStyling }}
         >
            {renderedColumns}
         </div>
      </div>
   )
})

export default ResumePaper;
