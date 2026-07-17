import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSection } from "@/store/resumeSlice.js";

import SectionColumnIndex from "./SectionColumnIndex.jsx";
import SectionRowIndex from "./SectionRowIndex.jsx";
import FontColor from "../../TextFormatting/FontColor.jsx";
import TextAlign from "../../TextFormatting/TextAlign.jsx";
import BackgroundColor from "../../TextFormatting/BackgroundColor.jsx";

import FontSize from "../../TextFormatting/FontSize.jsx";
import LineHeight from "../../TextFormatting/LineHeight.jsx";

import styles from "../SettingsModal.module.css";
import SectionFlexDirection from "./SectionFlexDirection.jsx";
import SectionJustifyContent from "./SectionJustifyContent.jsx";
import MoveSection from "./MoveSection.jsx";

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

//   const renderSettingsModalRows = () => {
   //  let componentsArr = [
      // { component: FontSize, label: "Font Size:", props: { section, column } },
      // { component: LineHeight, label: "Line Height:", props: { section, column } },
      // { component: TextAlign, label: "Text Align:", styling: { justifyContent: 'end' } },
      // { component: FontColor, label: "Font Color:" },
      // { component: BackgroundColor, label: 'Background Color:' },
   //  ];

//     return componentsArr.map((Component, index) => (
//       <div className='flexRow' key={index}>
//         <p className={styles.settingsModalLabel}>{Component.label}</p>
//         <Component.component
//           sections={sections}
//           columns={columns}
//           fields={fields}
//           // label={Component.label}
//           subsections={subsections}
//           resumeStyling={resumeStyling}
//           activeSectionId={activeSectionId}
//           {...Component.props}
//         />
//       </div>
//     ));
//   };

  return (
    <div className={styles.settingsModalWrapper}>
      <h2 className={styles.settingsModalHeader}>{section.label} Settings:</h2>
      <div className='flexRow'>
        <label
          className={styles.settingsModalLabel}
          htmlFor="hideOrShowHeading"
        >
          Show Section {section.label} Heading:
        </label>
        <input
          id="hideOrShowHeading"
          className={styles.settingsModalCheckbox}
          type="checkbox"
          checked={section.showHeading}
          onChange={() => hideOrShowHeading()}
        />
      </div>
      <span className={styles.sectionLabelSpan}>
        Move {section.label} Section:
      </span>
      <MoveSection section={section} />
      <SectionFlexDirection />
      <SectionJustifyContent />
      {/* {renderSettingsModalRows()} */}
    </div>
  );
};

export default SectionSettings;
