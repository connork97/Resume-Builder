import React, { useEffect, useState } from "react";

import styles from "../ResumePaper.module.css";
import { useSelector } from "react-redux";

const EndPageMarker = () => {
  const [showEndPageMarker, setShowEndPageMarker] = useState(false);

  const reduxColumns = useSelector((state) => state.resume.columns);
  const reduxSections = useSelector((state) => state.resume.sections);

  const getSectionRect = (sectionId) => {
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);

    if (!element) return null;

    return element.getBoundingClientRect();
  };

  useEffect(() => {
    reduxColumns.allIds.forEach((columnId) => {
      let columnSectionHeightTotal = 0;

      const columnById = reduxColumns.byId[columnId];
      columnById.sectionIds.forEach((sectionId) => {
        columnSectionHeightTotal += getSectionRect(sectionId).height;
      });
      console.log(columnSectionHeightTotal);
      if (columnSectionHeightTotal > 739.3) {
        setShowEndPageMarker(true);
        return;
      }
      setShowEndPageMarker(false);
    });
  }, [reduxColumns, reduxSections]);

  //   column.sectionIds?.forEach((sectionId) => {
  //     let sectionRect = getSectionRect(sectionId);
  //     columnSectionHeightTotal += sectionRect?.height;
  // console.log(sectionRect.height)
  // console.log(739.2 - columnSectionHeightTotal)
  //   });
  // if (columnSectionHeightTotal <= 739.2) setSectionsExceedPageHeight(false);
  //     if (columnSectionHeightTotal > 739.2) setSectionsExceedPageHeight(true);
  //     else setSectionsExceedPageHeight(false)

  if (!showEndPageMarker) {
    return;
  } else {
    return <div className={styles.endPageMarker}>Page is to long</div>;
  }
};

export default EndPageMarker;
