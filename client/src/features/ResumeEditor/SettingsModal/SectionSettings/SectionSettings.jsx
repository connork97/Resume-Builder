import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";


import styles from "../SettingsModal.module.css";
import SectionGrid from "./SectionGrid.jsx";

const SectionSettings = () => {
  const dispatch = useDispatch();

  const activeSectionIds = useSelector((state) => state.resume.activeSectionIds);
  const section = useSelector(
    (state) => state.resume.sections.byId[activeSectionIds[0]],
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
      {/* <div className="flexRow">
        <label>Orientation:</label>
        <button
          className="buttonMain"
          onClick={() => {
            let currentSectionColumns = section.layout.grid?.columns || 1;
            dispatch(
              updateSection({
                id: section.id,
                changes: {
                  layout: {
                    display: "grid",
                    grid: {
                      columns: currentSectionColumns,
                    },
                  },
                },
              }),
            );
            // setGridColumnsInput(currentSectionColumns);
          }}
        >
          Column
        </button>
        <button
          className="buttonMain"
          onClick={() => {
            dispatch(
              updateSection({
                id: section.id,
                changes: {
                  layout: {
                    display: "flex",
                  },
                },
              }),
            );
          }}
        >
          Row
        </button>
      </div>
      {section.layout.display === "flex" && <SectionFlex />} */}
      {/* {section.layout.display == "grid" && <SectionGrid section={section} />} */}
      <SectionGrid section={section} />
    </div>
  );
};

export default SectionSettings;
