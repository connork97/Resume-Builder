import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection, updateSubsection } from "../../store/resumeSlice.js";

import SlateHeading from "./SlateHeading.jsx";
import styles from './Section.module.css';
import SettingsModal from "./SettingsModal/SettingsModal.jsx";
import SubsectionRenderer from "./SubsectionRenderer.jsx";

const Section = ({ section, column }) => {
  useEffect(() => {
    if (!section) {
      console.error('Section component rendered without a valid section prop.');
      return null; // <-- prevents early render
    }
  }, []);

  const dispatch = useDispatch();

  const sectionRef = useRef(null);

  const resumeLayout = useSelector((state) => state.resume.layout);
  
  
  // const subsections = useSelector((state) => section.subsectionIds.filter((id) => state.resume.subsections.byId[id]));
  // console.log('SUBSECTIONS', subsections)
  
  const [isFirstColumn, setIsFirstColumn] = useState(false);
  const [isLastColumn, setIsLastColumn] = useState(false);
  const [isFirstRow, setIsFirstRow] = useState(false);
  const [isLastRow, setIsLastRow] = useState(false);
  const [additionalSectionStyling, setAddtionalSectionStyling] = useState({
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
  });

  const renderedSubsections = section.subsectionIds?.map((subId) => {
    const subsection = useSelector((state) => state.resume.subsections.byId[subId]);
    if (!subsection) {
      console.error(`Subsection with ID ${subId} not found.`);
      return null;
    }
    return (
      <SubsectionRenderer
        key={subsection.id}
        subsection={subsection}
        // layout={subsection.layout}
        // fields={subsection.fields}
        // fieldIds={subsection.fieldIds}
      />
    );
  });


  // useEffect(() => {
  //   setAddtionalSectionStyling((prevStyling) => {
  //     // console.log({...prevStyling, paddingLeft: isFirstColumn ?? resumeLayout.padding.left})
  //     return {
  //       ...prevStyling,
  //       paddingLeft: isFirstColumn ? resumeLayout.padding.left : '0',
  //       paddingRight: isLastColumn ? resumeLayout.padding.right : '0',
  //       paddingTop: isFirstRow ? resumeLayout.padding.top : '0',
  //       // marginBottom: isLastRow && 'auto',
  //       flex: isLastRow ? '1' : 'none',
  //       // height: isLastRow && '100%',
  //       // flex: isLastRow && '1',
  //       // paddingBottom: isLastRow && resumeLayout.padding.bottom,
  //      }
      
  //   })
  // }, [isFirstColumn, isLastColumn, isFirstRow, isLastRow, resumeLayout.padding]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSettingsIconClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveEditorId(null));
    dispatch(setActiveEditorSelection(null));
    dispatch(setActiveSectionId(section.id));
    setIsSettingsModalOpen(!isSettingsModalOpen);
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
          column={column}
        />
      )}
      <SlateHeading
        key={section.id}
        section={section}
        id={section.id}
      />
      {renderedSubsections}
    </div>
  );
};

export default Section;