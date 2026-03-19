import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection, updateSubsection } from "../../store/resumeSlice.js";

import SlateField from "./SlateField.jsx";
import SlateHeading from "./SlateHeading.jsx";
import styles from './SlateWrapper.module.css';
import LayoutRenderer from "./LayoutRenderer.jsx";

const SlateWrapper = ({ section, index }) => {
  const dispatch = useDispatch();
  // const { id, data } = section;
  const { id } = section;

  // if (!data || !data.subsections) return null; // <-- prevents early render
  if (!section || !section.subsections) return null; // <-- prevents early render

  const sectionsLength = useSelector((state) => state.resume.sections.length);
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);

  const [isFirstSection, setIsFirstSection] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);

  useEffect(() => {
    setIsFirstSection(index === 0);
    setIsLastSection(index === sectionsLength - 1);
  }, [index, sectionsLength]);

  // const setNewActiveSection = () => {
    // dispatch(setActiveSectionId(section.id));
  // }

  const handleSettingsIconClick = (e) => {
    e.stopPropagation();
    section.subsections.map((sub) => {
      console.log ("Subsection Layout: ", sub.layout);
      dispatch(updateSubsection({
        sectionId: section.id,
        subsectionId: sub.id,
        changes: {
          layout: {
            ...sub.layout,
            direction: sub.layout.direction === 'row' ? 'column' : 'row',
            justifyContent: 'space-between'
          }
        }
      }))
    });
    dispatch(setActiveEditorId(null));
    dispatch(setActiveEditorSelection(null));
    dispatch(setActiveSectionId(section.id));
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
      // onClick={}
      >
        <span
          className={styles.sectionSettingsButtonIcon}
          onClick={(e) => handleSettingsIconClick(e)}
        >
          ⚙️
        </span>
      </button>
      {/* <p>{section.value?.[0]?.children?.[0]?.text}</p> */}
      <SlateHeading
        key={section.id}
        section={section}
        id={section.id}
      />
      {/* {data.subsections.map((sub) => ( */}
      {section.subsections.map((sub) => (
        // <div key={sub.id} style={sub.styling}>
        <LayoutRenderer
          layout={sub.layout}
          fields={sub.fields}
        />
          // {console.log(sub)}
          // {sub.fields.map((field) => (
          //   <SlateField
          //     key={field.id}
          //     field={field}
          //     sectionId={id}
          //     subsectionId={sub.id}
            // />
          ))}
        {/* // </div> */}
      {/* ))} */}
    </div>
  );
};

export default SlateWrapper;