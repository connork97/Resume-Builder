import React, { forwardRef, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";

import Column from "./components/Column.jsx";

import styles from "./ResumePaper.module.css";
import EndPageMarker from "./components/EndPageMarker.jsx";

const ResumePaper = forwardRef(function ResumePaper(props, ref) {
  // const ResumePaper = (props) => {

  const editorRef = useRef(null);

  const resumeStyling = useSelector((state) => state.resume.styling);
  const columns = useSelector((state) => state.resume.columns);
  const sectionsById = useSelector(state => state.resume.sections.byId);


  //  const getIndicatorPosition = (topOrBottom) => {

  //     const columnSectionIds = column?.sectionIds;

  //     let total = 0;

  //     for (let id of columnSectionIds) {
  //        const sectionHeight = getSectionRect(id).height;
  //        if (topOrBottom === 'top') {
  //           if (id !== activeSectionId) {
  //              total += sectionHeight;
  //           } else {
  //              return total;
  //           }
  //        } else if (topOrBottom === 'bottom') {
  //           total += sectionHeight
  //           if (id === activeSectionId) {
  //              return total;
  //           }
  //        }
  //     }
  //     return total;
  //  }
  // Handle how many columns to render on the page based on resume layout settings.
  const resumeColumns = columns.allIds?.map((columnId) => {
    
    const column = columns.byId[columnId];
    if (!column) {
      console.error(`Column with ID ${columnId} not found.`);
      return null;
    }

    return <Column key={column.id} column={column} />;
  });

  return (
    <div className={styles.printPageRef} ref={ref}>
      <div
        className={`${props.isPrinting ? styles.printingPageContainer : styles.editingPageContainer}`}
        style={{ ...resumeStyling }}
        ref={editorRef}
        id="editorPage"
      >
        {resumeColumns}
        <EndPageMarker />
      </div>
    </div>
  );
});

export default ResumePaper;
