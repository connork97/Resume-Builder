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
  const resumeLayout = useSelector((state) => state.resume.layout);
  const resumeColumns = useSelector((state) => state.resume.layout.columns);

  if (!section || !section.subsections) return null; // <-- prevents early render

  const sectionRef = useRef(null);
  const sections = useSelector((state) => state.resume.sections);
  const sectionColumnIndex = section.layout.columnIndex;

  const [isFirstColumn, setIsFirstColumn] = useState(false);
  const [isLastColumn, setIsLastColumn] = useState(false);
  const [isFirstRow, setIsFirstRow] = useState(false);
  const [isLastRow, setIsLastRow] = useState(false);

  useEffect(() => {
    setIsFirstColumn(section.layout.columnIndex === 0);
    setIsLastColumn(section.layout.columnIndex === resumeColumns.length - 1);
    setIsFirstRow(sections.find((section) => {
      return section.layout.columnIndex === sectionColumnIndex && section.id === section.id;
    }) === section);
    setIsLastRow(sections.findLast((section) => {
      return section.layout.columnIndex === sectionColumnIndex && section.id === section.id;
    }) === section);
  }, [section, sectionColumnIndex]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSettingsIconClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveEditorId(null));
    dispatch(setActiveEditorSelection(null));
    dispatch(setActiveSectionId(section.id));
    setIsSettingsModalOpen(!isSettingsModalOpen);
  }

  const additionalSectionStyling = {
      paddingLeft: isFirstColumn && resumeLayout.padding.left,
      paddingRight: isLastColumn && resumeLayout.padding.right,
      paddingTop: isFirstRow ? resumeLayout.padding.top : '0.5rem',
      paddingBottom: isLastRow ? resumeLayout.padding.bottom : '0.5rem',
    }

  const pseudoContainerStyling = {
    minHeight: (
      (sectionRef.current && !isFirstRow && !isLastRow) ? sectionRef.current.clientHeight + 5 + 'px'
        : (sectionRef.current && (isFirstRow || isLastRow)) ? 'calc(100% - 2.5rem)'
          : 'calc(100% + 5px)'
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