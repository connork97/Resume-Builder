import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection, updateSubsection } from "../../store/resumeSlice.js";

import SlateHeading from "./SlateHeading.jsx";
import styles from './Section.module.css';
import SettingsModal from "./SettingsModal/SettingsModal.jsx";
import SubsectionRenderer from "./SubsectionRenderer.jsx";

const Section = ({ section, index }) => {
  const dispatch = useDispatch();


  const resumeStyling = useSelector((state) => state.resume.styling);
  const resumeLayout = useSelector((state) => state.resume.layout);
  const resumeColumns = useSelector((state) => state.resume.layout.columns);

  if (!section || !section.subsections) return null; // <-- prevents early render

  const sectionRef = useRef(null);
  const sections = useSelector((state) => state.resume.sections);
  const sectionId = section.id;
  const sectionColumnIndex = section.layout.columnIndex;
  const columns = useSelector(state => state.resume.layout.columns);
  const column = useSelector(state => state.resume.layout.columns[sectionColumnIndex]);
  
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

  const [haveColumnsChanged, setHaveColumnsChanged] = useState(false);

  useEffect(() => {
    if (columns.length === 1) {
      setIsFirstColumn(true);
      setIsLastColumn(true);
      setIsFirstRow(section.id === sections[0].id);
      setIsLastRow(section.id === sections[sections.length - 1].id);
    } else if (columns.length > 1) {
      setIsFirstColumn(section.layout.columnIndex === 0);
      setIsLastColumn(section.layout.columnIndex === columns.length - 1);
      const sectionsInSameColumn = sections.filter(sec => sec.layout.columnIndex === section.layout.columnIndex);
      setIsFirstRow(section.id === sectionsInSameColumn[0].id);
      setIsLastRow(section.id === sectionsInSameColumn[sectionsInSameColumn.length - 1].id);
    }
  }, [haveColumnsChanged]);

  useEffect(() => {
    setAddtionalSectionStyling((prevStyling) => {
      // console.log({...prevStyling, paddingLeft: isFirstColumn ?? resumeLayout.padding.left})
      return {
        ...prevStyling,
        paddingLeft: isFirstColumn ? resumeLayout.padding.left : '0',
        paddingRight: isLastColumn ? resumeLayout.padding.right : '0',
        paddingTop: isFirstRow ? resumeLayout.padding.top : '0',
        // marginBottom: isLastRow && 'auto',
        flex: isLastRow ? '1' : 'none',
        // height: isLastRow && '100%',
        // flex: isLastRow && '1',
        // paddingBottom: isLastRow && resumeLayout.padding.bottom,
       }
      
    })
  }, [haveColumnsChanged, isFirstColumn, isLastColumn, isFirstRow, isLastRow, resumeLayout.padding]);

  // useEffect(() => {
  //   console.log('settings addtional section styling')
  //   setAddtionalSectionStyling({
  //     paddingLeft: isFirstColumn ? resumeLayout.padding.left : '0.5rem',
  //     paddingRight: isLastColumn ? resumeLayout.padding.right : '0.5rem',
  //     paddingTop: isFirstRow ? resumeLayout.padding.top : '0.5rem',
  //     paddingBottom: isLastRow ? resumeLayout.padding.bottom : '0.5rem',
  //   })
  //  }, [sections, isFirstColumn, isLastColumn, isFirstRow, isLastRow, resumeLayout.padding]);
  
  // useEffect(() => {
  //   setIsFirstColumn(section.layout.columnIndex === 0);
  //   setIsLastColumn(section.layout.columnIndex === resumeColumns.length - 1);
  //   sections.map((section) => {
  //     if (section.layout.columnIndex === sectionColumnIndex && section.id === sectionId) {
  //       console.log('temp', section)
  //       return section;
  //     }
      // return false;
    // });
    // console.log('temp: ', temp);
    // setIsFirstRow(sections.find((section) => {
    //   return section.layout.columnIndex === sectionColumnIndex && section.id === sectionId;
    // }) === section);
  //   setIsLastRow(sections.findLast((section) => {
  //     return section.layout.columnIndex === sectionColumnIndex && section.id === sectionId;
  //   }) === section);
  // }, [columns, sectionColumnIndex]);

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
          setHaveColumnsChanged={setHaveColumnsChanged}
          column={column}
        />
      )}
      <SlateHeading
        key={section.id}
        section={section}
        id={section.id}
      />
      {section.subsections.map((sub) => (
        <SubsectionRenderer
          key={sub.id}
          sub={sub}
          // layout={sub.layout}
          // fields={sub.fields}
          // fieldIds={sub.fieldIds}
        />

      ))}
    </div>
  );
};

export default Section;