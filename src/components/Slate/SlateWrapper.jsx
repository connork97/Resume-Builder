import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection, updateSubsection } from "../../store/resumeSlice.js";

import SlateField from "./SlateField.jsx";
import SlateHeading from "./SlateHeading.jsx";
import styles from './SlateWrapper.module.css';
import LayoutRenderer from "./LayoutRenderer.jsx";
import SettingsModal from "./SettingsModal.jsx";

const SlateWrapper = ({ section, index }) => {
  const dispatch = useDispatch();
  
  
  const resumeStyling = useSelector((state) => state.resume.styling);
  
  if (!section || !section.subsections) return null; // <-- prevents early render
  
  const sectionRef = useRef(null);
  const sectionsLength = useSelector((state) => state.resume.sections.length);
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);

  const [isFirstSection, setIsFirstSection] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);

  const [resumeColumnCount, setResumeColumnCount] = useState(null);

  const [sectionRowIndex, setSectionRowIndex] = useState(null);

  useEffect(() => {
    let columnCount = null;
    let rowIndex = null;
    if (resumeStyling.gridTemplateColumns && resumeStyling.display === 'grid') {
      columnCount = resumeStyling.gridTemplateColumns.split(' ').length;
      rowIndex = Math.floor(index / columnCount);
      const sectionRowIsFirstRow = rowIndex === 0;
      const sectionRowIsLastRow = rowIndex === Math.floor((sectionsLength - 1) / columnCount);
      if (sectionRowIsFirstRow) setIsFirstSection(true);
      if (sectionRowIsLastRow) setIsLastSection(true);
    } else {
      setIsFirstSection(index === 0);
      setIsLastSection(index === sectionsLength - 1);
    }
    setResumeColumnCount(columnCount);
    setSectionRowIndex(rowIndex);

    // console.log("Section Index: ", index);
    // console.log("Resume Grid Template Columns: ", resumeStyling.gridTemplateColumns);
    console.log("Section Row: ", sectionRowIndex);
    console.log("Column Count: ", columnCount);
  }, [index, sectionRowIndex, resumeStyling.gridTemplateColumns, resumeColumnCount]);


  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {

    setIsFirstSection(index === 0);
    setIsLastSection(index === sectionsLength - 1);
  }, [index, sectionsLength]);

  const handleSettingsIconClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveEditorId(null));
    dispatch(setActiveEditorSelection(null));
    dispatch(setActiveSectionId(section.id));
    setIsSettingsModalOpen(!isSettingsModalOpen);
    // section.subsections.map((sub) => {
    //   console.log ("Subsection Layout: ", sub.layout);
    //   dispatch(updateSubsection({
    //     sectionId: section.id,
    //     subsectionId: sub.id,
    //     changes: {
    //       layout: {
    //         ...sub.layout,
    //         direction: sub.layout.direction === 'row' ? 'column' : 'row',
    //         justifyContent: 'space-between'
    //       }
    //     }
    //   }))
    // });
  }

  const additionalSectionStyling = {
    paddingTop: isFirstSection && '2rem',
    paddingBottom: isLastSection && '2rem',
    // breakInside: resumeStyling.columns ? 'avoid' : null,
  };

  const pseudoContainerStyling = {
    minHeight: (
      (sectionRef.current && !isFirstSection && !isLastSection) ? sectionRef.current.clientHeight + 7.5 + 'px'
      : (sectionRef.current && (isFirstSection || isLastSection)) ? 'calc(100% - 1.5rem)'
      : 'calc(100% + 7.5px)'
    ),
    // height: (isFirstSection || isLastSection) && 'calc(100% - 1.5rem)',
  };

  return (
    <div
      className={styles.mainSlateContainerDiv}
      ref={sectionRef}
      style={{
        // ...data.styling,
        ...section.styling,
        ...additionalSectionStyling
        // paddingTop:
        //   isFirstSection && '2rem',
        // paddingBottom: isLastSection && '2rem',
      }}
      onClick={() => dispatch(setActiveSectionId(section.id))}
    >
      <div
        className={styles.mainSlatePsuedoContainerDiv}
        style={
          pseudoContainerStyling
          // height: (isFirstSection || isLastSection) && 'calc(100% - 1.5rem)',
        }
      />
      <button
        className={styles.sectionSettingsButton}
      >
        <span
          className={styles.sectionSettingsButtonIcon}
          onClick={(e) => handleSettingsIconClick(e)}
        >
          ⚙️
        </span>
      </button>
      {isSettingsModalOpen && (
        <SettingsModal
          section={section}
          isSettingsModalOpen={isSettingsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />
      )}
      <SlateHeading
        key={section.id}
        section={section}
        id={section.id}
      />
      {section.subsections.map((sub) => (
        <LayoutRenderer
          layout={sub.layout}
          fields={sub.fields}
        />

      ))}
    </div>
  );
};

export default SlateWrapper;