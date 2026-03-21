import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection, updateSubsection } from "../../store/resumeSlice.js";

import SlateHeading from "./SlateHeading.jsx";
import styles from './Section.module.css';
import LayoutRenderer from "./LayoutRenderer.jsx";
import SettingsModal from "./SettingsModal/SettingsModal.jsx";

const Section = ({ section, index }) => {
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
  }

  const additionalSectionStyling = {
    paddingTop: isFirstSection && '2rem',
    paddingBottom: isLastSection && '2rem',
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
      className={styles.sectionContainerDiv}
      ref={sectionRef}
      style={{
        ...section.styling,
        ...additionalSectionStyling
      }}
      onClick={() => dispatch(setActiveSectionId(section.id))}
    >
      <div
        className={styles.sectionPseudoContainerDiv}
        style={
          pseudoContainerStyling
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

export default Section;