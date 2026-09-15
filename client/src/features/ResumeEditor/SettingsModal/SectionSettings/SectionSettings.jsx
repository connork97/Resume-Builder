import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";


import styles from "../SettingsModal.module.css";
import SectionGrid from "./SectionGrid.jsx";

const SectionSettings = () => {
  const dispatch = useDispatch();

  const activeSectionIds = useSelector((state) => state.resume.present.activeSectionIds);
  const section = useSelector(
    (state) => state.resume.present.sections.byId[activeSectionIds?.[0]],
  );

  if (!section) {
    return null;
  }

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
      <SectionGrid section={section} />
    </div>
  );
};

export default SectionSettings;
