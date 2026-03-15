import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSection } from "../../store/resumeSlice.js";

import SlateField from "./SlateField.jsx";
import styles from './SlateWrapper.module.css';

const SlateWrapper = ({ section, index }) => {
  const dispatch = useDispatch();
  const { id, data } = section;

  if (!data || !data.subsections) return null; // <-- prevents early render

  const sectionsLength = useSelector((state) => state.resume.sections.length);
  const activeSectionId = useSelector((state) => state.resume.activeSectionId);

  const [isFirstSection, setIsFirstSection] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);

  useEffect(() => {
    setIsFirstSection(index === 0);
    setIsLastSection(index === sectionsLength - 1);
  }, [index, sectionsLength]);

  const setNewActiveSection = () => {
    console.log("Setting active section", section.id);
    dispatch(setActiveSection(section.id));
  }

  return (
    <div
      className={styles.mainSlateContainerDiv}
      style={{
        ...data.styling,
        ...section.styling,
        marginTop:
          isFirstSection && '2rem',
        marginBottom: isLastSection && '2rem'
      }}
      onClick={setNewActiveSection}
    >
      <div
        className={styles.mainSlatePsuedoContainerDiv}
        style={{
          ...data.styling,
          ...section.styling
        }}
      />

      <button className={styles.sectionSettingsButton}>
        ⚙️
      </button>

      {data.subsections.map((sub) => (
        <div key={sub.id} style={sub.styling}>
          <SlateField
            key={data.sectionTitle}
            field={data.sectionTitle}
            sectionId={id}
            subsectionId={sub.id}
          />
          {sub.fields.map((field) => (
            <SlateField
              key={field.id}
              field={field}
              sectionId={id}
              subsectionId={sub.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SlateWrapper;