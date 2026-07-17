import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";

import MoveSection from "./MoveSection.jsx";
import SectionFlex from "./SectionFlex";

import styles from "../SettingsModal.module.css";

const SectionSettings = () => {
  const dispatch = useDispatch();

  const section = useSelector(
    (state) => state.resume.sections.byId[state.resume.activeSectionId],
  );

  const hideOrShowHeading = () => {
    const newShowHeadingValue = !section.showHeading;
    dispatch(
      updateSection({
        id: section.id,
        changes: {
          showHeading: newShowHeadingValue,
        },
      }),
    );
  };

  return (
    <div className={styles.settingsModalWrapper}>
      <h2 className={styles.settingsModalHeader}>{section.label} Settings:</h2>
      <div className="flexRow">
        <label className="flexRow" htmlFor="hideOrShowHeading">
          Show Section {section.label} Heading:
          <input
            id="hideOrShowHeading"
            type="checkbox"
            checked={section.showHeading}
            onChange={() => hideOrShowHeading()}
          />
        </label>
      </div>
      <span className={styles.sectionLabelSpan}>
        Move {section.label} Section:
      </span>
      <MoveSection section={section} />
      <SectionFlex />
    </div>
  );
};

export default SectionSettings;
