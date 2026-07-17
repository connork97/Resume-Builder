import React, { useEffect, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateResume, updateSection } from "@/store/resumeSlice.js";
import { getActiveMark, setLineHeightOffset } from "@/helpers/marks.js";
import {
  getCascadedLineHeight,
  getNumber,
  roundToTenth,
} from "@/helpers/leafHelpers.js";

import { MdFormatLineSpacing } from "react-icons/md";

import styles from "./TextFormatting.module.css";

/* eslint-disable react-hooks/set-state-in-effect */

const LINE_HEIGHT_STEP = 0.1;

const parseLineHeight = (value, fallback = null) => {
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(parsed) ? fallback : parsed;
};

const LineHeight = ({
  editor,
  selection,
  fields,
  subsections,
  activeSectionId,
  activeEditorId,
  resumeStyling,
}) => {
  const dispatch = useDispatch();
  const reduxSections = useSelector((state) => state.resume.sections);
  const reduxColumns = useSelector((state) => state.resume.columns);
  const activeSectionIds = useSelector(
    (state) => state.resume.activeSectionIds,
  );

  const getResumeLineHeight = useCallback(
    () => roundToTenth(getNumber(resumeStyling?.lineHeight, 1.2)),
    [resumeStyling],
  );

  const effectiveSectionId = activeSectionId;

  const getSection = useCallback(
    () => reduxSections.byId[effectiveSectionId],
    [reduxSections, effectiveSectionId],
  );

  const getColumn = useCallback(() => {
    const sectionData = getSection();
    if (!sectionData) return null;
    return reduxColumns?.byId?.[sectionData.columnId];
  }, [reduxColumns, getSection]);

  const [lineHeightInputValue, setLineHeightInputValue] = useState(
    getResumeLineHeight(),
  );

  useEffect(() => {
    if (editor && selection && activeEditorId && fields) {
      const field = fields.byId[activeEditorId];
      if (field) {
        const subsection = subsections.byId[field.subsectionId];
        const sectionData = subsection
          ? reduxSections.byId[subsection.sectionId]
          : null;
        const columnData = sectionData
          ? reduxColumns.byId[sectionData.columnId]
          : null;

        if (subsection && sectionData) {
          const leafStyling = {
            lineHeightOffset: getActiveMark(editor, "lineHeightOffset") ?? 0,
          };
          const totalLineHeight = getCascadedLineHeight({
            resumeStyling,
            columnStyling: columnData?.styling,
            sectionStyling: sectionData?.styling,
            subsectionStyling: subsection?.styling,
            fieldStyling: field?.styling,
            leafStyling,
          });
          setLineHeightInputValue(totalLineHeight);
          return;
        }
      }
    }

    if (
      editor &&
      selection &&
      activeEditorId &&
      !fields?.byId?.[activeEditorId]
    ) {
      const headingSection = reduxSections.byId[activeEditorId];
      if (headingSection) {
        const columnData = reduxColumns.byId[headingSection.columnId];
        const leafStyling = {
          lineHeightOffset: getActiveMark(editor, "lineHeightOffset") ?? 0,
        };
        const totalLineHeight = getCascadedLineHeight({
          resumeStyling,
          columnStyling: columnData?.styling,
          sectionStyling: headingSection?.styling,
          leafStyling,
        });
        setLineHeightInputValue(totalLineHeight);
        return;
      }
    }

    if (effectiveSectionId && !editor) {
      const sectionData = getSection();
      const columnData = getColumn();
      const totalLineHeight = getCascadedLineHeight({
        resumeStyling,
        columnStyling: columnData?.styling,
        sectionStyling: sectionData?.styling,
      });
      setLineHeightInputValue(totalLineHeight);
      return;
    }

    setLineHeightInputValue(getResumeLineHeight());
  }, [
    editor,
    selection,
    activeEditorId,
    effectiveSectionId,
    getSection,
    getColumn,
    getResumeLineHeight,
    resumeStyling,
    reduxSections,
    reduxColumns,
    fields,
    subsections,
  ]);

  const getTargetLineHeight = (newLineHeight) => {
    const currentValue = parseLineHeight(
      lineHeightInputValue,
      getResumeLineHeight(),
    );

    if (newLineHeight === "increment") {
      return roundToTenth(currentValue + LINE_HEIGHT_STEP);
    }

    if (newLineHeight === "decrement") {
      return roundToTenth(currentValue - LINE_HEIGHT_STEP);
    }

    return roundToTenth(parseLineHeight(newLineHeight, currentValue));
  };

  const setNewLineHeight = (newLineHeight = lineHeightInputValue) => {
    const targetLineHeight = getTargetLineHeight(newLineHeight);
    if (targetLineHeight <= 0) return;

    const sectionIdToUse = effectiveSectionId;

    // Case 1:  Sections are Selected
    if (activeSectionIds.length > 0) {
      activeSectionIds.forEach((sectionId) => {
        const sectionData = reduxSections.byId[sectionId];
        if (!sectionData) return;

        const columnData = reduxColumns.byId[sectionData.columnId];
        const currentSectionLineHeightOffset = getNumber(
          sectionData?.styling?.lineHeightOffset,
          0,
        );
        let newSectionLineHeightOffset = currentSectionLineHeightOffset;

        if (newLineHeight === "increment") {
          newSectionLineHeightOffset = roundToTenth(
            currentSectionLineHeightOffset + LINE_HEIGHT_STEP,
          );
        } else if (newLineHeight === "decrement") {
          newSectionLineHeightOffset = roundToTenth(
            currentSectionLineHeightOffset - LINE_HEIGHT_STEP,
          );
        } else {
          const inheritedLineHeight = getCascadedLineHeight({
            resumeStyling,
            columnStyling: columnData?.styling,
          });
          newSectionLineHeightOffset = roundToTenth(
            targetLineHeight - inheritedLineHeight,
          );
        }

        dispatch(
          updateSection({
            id: sectionId,
            changes: {
              styling: { lineHeightOffset: newSectionLineHeightOffset },
            },
          }),
        );
      });

      setLineHeightInputValue(targetLineHeight);
      return;
    }

    // Case:  A Slate Field is Selected
    if (editor && activeEditorId && fields) {
      const field = fields.byId[activeEditorId];
      if (field) {
        const subsection = subsections.byId[field.subsectionId];
        const sectionData = subsection
          ? reduxSections.byId[subsection.sectionId]
          : null;
        const columnData = sectionData
          ? reduxColumns.byId[sectionData.columnId]
          : null;

        if (subsection && sectionData) {
          const inheritedLineHeight = getCascadedLineHeight({
            resumeStyling,
            columnStyling: columnData?.styling,
            sectionStyling: sectionData?.styling,
            subsectionStyling: subsection?.styling,
            fieldStyling: field?.styling,
          });

          if (newLineHeight === "increment" || newLineHeight === "decrement") {
            const currentLeafOffset = getNumber(
              getActiveMark(editor, "lineHeightOffset"),
              0,
            );
            const offsetChange =
              newLineHeight === "increment"
                ? LINE_HEIGHT_STEP
                : -LINE_HEIGHT_STEP;
            setLineHeightOffset(
              editor,
              roundToTenth(currentLeafOffset + offsetChange),
            );
          } else {
            setLineHeightOffset(
              editor,
              roundToTenth(targetLineHeight - inheritedLineHeight),
            );
          }

          setLineHeightInputValue(targetLineHeight);
          return;
        }
      }
    }

    // Case:  Section Heading is Selected
    if (editor && activeEditorId && !fields?.byId?.[activeEditorId]) {
      const headingSection = reduxSections.byId[activeEditorId];
      if (headingSection) {
        const columnData = reduxColumns.byId[headingSection.columnId];
        const inheritedLineHeight = getCascadedLineHeight({
          resumeStyling,
          columnStyling: columnData?.styling,
          sectionStyling: headingSection?.styling,
        });

        if (newLineHeight === "increment" || newLineHeight === "decrement") {
          const currentLeafOffset = getNumber(
            getActiveMark(editor, "lineHeightOffset"),
            0,
          );
          const offsetChange =
            newLineHeight === "increment"
              ? LINE_HEIGHT_STEP
              : -LINE_HEIGHT_STEP;
          setLineHeightOffset(
            editor,
            roundToTenth(currentLeafOffset + offsetChange),
          );
        } else {
          setLineHeightOffset(
            editor,
            roundToTenth(targetLineHeight - inheritedLineHeight),
          );
        }

        setLineHeightInputValue(targetLineHeight);
        return;
      }
    }

    // Case: One Section is Selected (likely from the section settings modal)
    if (!editor && sectionIdToUse && !(activeSectionIds.length > 0)) {
      const sectionData = getSection();
      if (!sectionData) return;

      const inheritedLineHeight = getCascadedLineHeight({
        resumeStyling,
        columnStyling: getColumn()?.styling,
      });
      const newSectionLineHeightOffset = roundToTenth(
        targetLineHeight - inheritedLineHeight,
      );

      dispatch(
        updateSection({
          id: sectionIdToUse,
          changes: {
            styling: { lineHeightOffset: newSectionLineHeightOffset },
          },
        }),
      );
      setLineHeightInputValue(targetLineHeight);
    } else if (!editor && !sectionIdToUse) {
      dispatch(
        updateResume({
          key: "styling",
          changes: {
            lineHeight: targetLineHeight,
          },
        }),
      );
      setLineHeightInputValue(targetLineHeight);
    }
  };

  return (
    <div className={styles.toolbarFlexWrapper}>
      <button className="buttonMain">
        <MdFormatLineSpacing
          style={{
            scale: "1.1",
            marginRight: "0.25rem",
            pointerEvents: "none",
          }}
        />
        <input
          className="inputMain"
          type="number"
          step="0.01"
          style={{
            width: "3.5rem",
            borderLeft: "none",
            borderRight: "none",
            marginLeft: "-1.75rem",
            marginRight: "-0.5rem",
            paddingRight: "0.5rem",
            textAlign: "right",
          }}
          value={lineHeightInputValue}
          onChange={(e) => setLineHeightInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && setNewLineHeight(lineHeightInputValue)
          }
        />
      </button>
      {/* <div className="flexColumn" style={{height: '2rem', gap: 0}}>
        <button
          className="buttonMain"
          style={{height: '50%'}}
          onClick={() => setNewLineHeight("decrement")}
        >
          -
        </button>

        <button
          className="buttonMain"
          style={{height: '50%'}}

          onClick={() => setNewLineHeight("increment")}
        >
          +
        </button>
      </div> */}
    </div>
  );
};

export default LineHeight;
