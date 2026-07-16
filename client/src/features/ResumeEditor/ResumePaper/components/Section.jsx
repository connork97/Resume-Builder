import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveEditorId,
  setActiveEditorSelection,
  setActiveSectionId,
  setActiveSectionIds,
} from "../../../../store/resumeSlice.js";
// import { setActiveSectionId, setActiveEditorId, setActiveEditorSelection } from "../../../../../resumeSlice.js";

import SlateHeading from "../../../Slate/SlateHeading.jsx";
import styles from "./Section.module.css";
import SettingsModal from "../../SettingsModal/SettingsModal.jsx";
import SubsectionRenderer from "./Subsection.jsx";
import SectionPadding from "./SectionPadding.jsx";
import { getContrastingColor } from "@/utils/colorUtils.js";
import { parseRemValue } from "@/utils/formatters.js";
import SectionBorder from "./SectionBorder.jsx";

const Section = ({ section, column }) => {
  useEffect(() => {
    if (!section) {
      console.error("Section component rendered without a valid section prop.");
      return null; // <-- prevents early render
    }
  }, []);

  const dispatch = useDispatch();

  const resumeLayout = useSelector((state) => state.resume.layout);
  const columns = useSelector((state) => state.resume.columns);
  const activeSectionIds = useSelector(
    (state) => state.resume.activeSectionIds,
  );
  const subsections = useSelector((state) => state.resume.subsections);

  const sectionRef = useRef(null);

  const [isFirstColumn, setIsFirstColumn] = useState(false);
  const [isLastColumn, setIsLastColumn] = useState(false);
  const [isFirstRow, setIsFirstRow] = useState(false);
  const [isLastRow, setIsLastRow] = useState(false);
  const [sectionPadding, setSectionPadding] = useState({
    paddingLeft: "0",
    paddingRight: "0",
    paddingTop: "0",
    paddingBottom: "0",
  });

  (useEffect(() => {
    if (!section || !column) return;

    // Determine if section is in the first column
    const columnIndex = columns.allIds.indexOf(column.id);
    if (columnIndex === 0) setIsFirstColumn(true);
    else if (columnIndex !== 0) setIsFirstColumn(false);

    // Determine if section is in the last column
    const totalColumns = columns.allIds.length;
    if (columnIndex === totalColumns - 1) setIsLastColumn(true);
    else if (columnIndex !== totalColumns - 1) setIsLastColumn(false);

    // Determine if section is in the first row of column
    const sectionIndex = column.sectionIds.indexOf(section.id);
    if (sectionIndex === 0) setIsFirstRow(true);
    else if (sectionIndex !== 0) setIsFirstRow(false);

    // Determine if section is in the last row of column
    const totalSectionsInColumn = column.sectionIds.length;
    if (sectionIndex === totalSectionsInColumn - 1) setIsLastRow(true);
    else if (sectionIndex !== totalSectionsInColumn - 1) setIsLastRow(false);
  }),
    [resumeLayout, section.columnId, column.sectionIds]);

  useEffect(() => {
    setSectionPadding((prevStyling) => {
      const parsedSectionPadding = {
        top: parseRemValue(section?.layout?.padding?.top) ?? 0,
        bottom: parseRemValue(section?.layout?.padding?.bottom) ?? 0,
        left: parseRemValue(column?.layout?.padding?.left) ?? 0,
        right: parseRemValue(column?.layout?.padding?.right) ?? 0,
      };

      const parsedResumeGap = {
        vertical: parseRemValue(resumeLayout?.gap?.vertical) ?? 0,
        horizontal: parseRemValue(resumeLayout?.gap?.horizontal) ?? 0,
      };

      const sectionPaddingTop =
        parseRemValue(section.layout?.padding?.top) +
        parseRemValue(resumeLayout.gap?.vertical) +
        "rem";
      const sectionPaddingBottom =
        parseRemValue(section.layout?.padding?.bottom) +
        parseRemValue(resumeLayout.gap?.vertical) +
        "rem";
      return {
        ...prevStyling,
        paddingLeft: isFirstColumn
          ? resumeLayout.padding.left
          : `${parsedSectionPadding.left + parsedResumeGap.horizontal}rem`,
        // : column?.layout?.padding?.left ?? resumeLayout.padding.left,
        paddingRight: isLastColumn
          ? resumeLayout.padding.right
          : `${parsedSectionPadding.right + parsedResumeGap.horizontal}rem`,
        // : column?.layout?.padding?.right ?? resumeLayout.padding.right,
        paddingTop: isFirstRow
          ? resumeLayout?.padding?.top
          : // ? resumeLayout?.gap?.vertical
            `${parsedSectionPadding.top + parsedResumeGap.vertical}rem`,
        // : sectionPaddingTop,
        // : section.layout?.padding?.top ?? resumeLayout.padding.top,
        // : section?.layout?.padding?.top ?? column?.layout?.padding?.top,
        paddingBottom:
          !isLastRow &&
          `${parsedSectionPadding.bottom + parsedResumeGap.vertical}rem`,
        // paddingBottom: sectionPaddingBottom,
        // paddingBottom: !isLastRow && (section?.layout?.padding?.bottom ?? resumeLayout.padding.bottom),
        // paddingBottom: isLastRow
        // // ? resumeLayout?.gap?.vertical
        // ? null
        // : section.layout?.padding?.bottom ?? resumeLayout.padding.bottom,
        // : section?.layout?.padding?.bottom ?? column?.layout?.padding?.top,
        flex: isLastRow ? "1" : "none",
        // borderTop: section.styling?.border?.top ?? 'none',
        // borderBottom: section.styling?.border?.bottom ?? 'none',
        // borderLeft: section.styling?.border?.left ?? 'none',
        // borderRight: section.styling?.border?.right ?? 'none',
      };
    });
  }, [
    isFirstColumn,
    isLastColumn,
    isFirstRow,
    isLastRow,
    resumeLayout.padding,
    resumeLayout.gap,
    section.layout?.padding,
    column.layout.padding,
    section,
  ]);

  const renderedSubsections = section.subsectionIds?.map((subId) => {
    const subsection = subsections.byId[subId];
    if (!subsection) {
      console.error(`Subsection with ID ${subId} not found.`);
      return null;
    }
    return <SubsectionRenderer key={subsection.id} subsection={subsection} />;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSettingsIconClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveEditorId(null));
    dispatch(setActiveEditorSelection(null));
    dispatch(setActiveSectionId(section.id));
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  const handleSetActiveSection = (e) => {
    if (e.ctrlKey) {
      dispatch(setActiveSectionIds(section.id));
    } else {
      dispatch(setActiveSectionId(section.id));
    }
  };

  const sectionIsActive = activeSectionIds.includes(section.id);

  const sectionBorder = section.styling?.border;
  return (
    <div
      className={`${styles.sectionContainerDiv} ${sectionIsActive && styles.activeSectionContainer}`}
      data-section-id={section.id}
      ref={sectionRef}
      style={{
        ...section.styling,
        ...sectionPadding,
        outlineColor: section.styling?.color,
      }}
      onClick={handleSetActiveSection}
    >
      {sectionBorder?.top && (
        <SectionBorder
          sectionBorder={sectionBorder.top}
          borderSide="top"
        />
      )}
      <div
        className={`${styles.sectionContentWrapper} ${sectionIsActive && styles.active}`}
        data-section-id={section.id}
        ref={sectionRef}
      >
        <button className={styles.sectionSettingsButton}>
          <span
            className={styles.sectionSettingsButtonIcon}
            onClick={handleSettingsIconClick}
          >
            ⚙️
          </span>
        </button>
        {section.showHeading !== false && (
          <SlateHeading key={section.id} section={section} id={section.id} />
        )}
        {renderedSubsections}
      </div>
      {isSettingsModalOpen && (
        <SettingsModal
          section={section}
          isSettingsModalOpen={isSettingsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          column={column}
        />
      )}
      {sectionBorder?.bottom && (
        <SectionBorder
          sectionBorder={sectionBorder.bottom}
          borderSide="bottom"
        />
      )}
    </div>
  );
};

export default Section;
