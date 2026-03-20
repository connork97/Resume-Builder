import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection, updateSubsection } from "../../store/resumeSlice.js";

import SlateField from "./SlateField.jsx";
import SlateHeading from "./SlateHeading.jsx";
import styles from './SlateWrapper.module.css';
import LayoutRenderer from "./LayoutRenderer.jsx";
import SettingsModal from "./SettingsModal.jsx";

const SlateWrapper = ({ section, index }) => {
  const dispatch = useDispatch();

  if (!section || !section.subsections) return null; // <-- prevents early render

  const sectionsLength = useSelector((state) => state.resume.sections.length);
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);

  const [isFirstSection, setIsFirstSection] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);

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

  return (
    <div
      className={styles.mainSlateContainerDiv}
      style={{
        // ...data.styling,
        ...section.styling,
        paddingTop:
          isFirstSection && '2rem',
        paddingBottom: isLastSection && '2rem'
      }}
      onClick={() => dispatch(setActiveSectionId(section.id))}
    >
      <div
        className={styles.mainSlatePsuedoContainerDiv}
        style={{
          height: (isFirstSection || isLastSection) && 'calc(100% - 1.5rem)',
        }}
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