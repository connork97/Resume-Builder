import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateColumn, updateSection } from "@/store/resumeSlice.js";

import ToolbarButton from "@/features/ResumeEditor/EditorToolbar/components/shared/ToolbarButton.jsx";

import styles from "@/features/ResumeEditor/EditorToolbar/components/RichTextToolbar.module.css";

const MoveSection = ({ section }) => {
  const dispatch = useDispatch();

  const sections = useSelector((state) => state.resume.sections);
  const columns = useSelector((state) => state.resume.columns);
  const [columnIndexInputValue, setColumnIndexInputValue] = useState("");

  // ! BEGIN COLUMN JAVASCRIPT ! //

  useEffect(() => {
    const columnIndex = columns.allIds.indexOf(section.columnId);
    if (columnIndex >= 0) setColumnIndexInputValue(columnIndex);
    else {
      setColumnIndexInputValue("?");
      console.error(
        `Invalid Section Column Index.  Column with ID ${section.columnId} not found in columns state.`,
      );
    }
  }, [section.columnId]);

  const moveSectionLeftOrRight = (leftOrRight) => {
    let newColumnIndex;

    if (leftOrRight === "right") newColumnIndex = columnIndexInputValue + 1;
    else if (leftOrRight === "left") newColumnIndex = columnIndexInputValue - 1;
    // else if (leftOrRight === 'input') newColumnIndex = parseInt(columnIndexInputValue);

    if (newColumnIndex < 0 || newColumnIndex >= columns.allIds.length) {
      alert(`Cannot move ${section.label} section any further ${leftOrRight}.`);
      return;
    }

    const oldColumnId = section.columnId;
    const newColumnId = columns.allIds[newColumnIndex];

    if (oldColumnId === newColumnId) return;

    const oldColumn = columns.byId[oldColumnId];
    const newColumn = columns.byId[newColumnId];

    const oldSectionIds = oldColumn.sectionIds.filter(
      (id) => id !== section.id,
    );

    const newColumnSectionIdsSorted = newColumn.sectionIds
      .map((id) => sections.byId[id])
      .filter(Boolean)
      .sort((a, b) => a.position - b.position)
      .map((section) => section.id);

    const insertIndex = newColumnSectionIdsSorted.findIndex((id) => {
      return sections.byId[id].position > section.position;
    });

    const newSectionIds = [...newColumnSectionIdsSorted];

    if (insertIndex === -1) {
      newSectionIds.push(section.id);
    } else {
      newSectionIds.splice(insertIndex, 0, section.id);
    }

    dispatch(
      updateSection({
        id: section.id,
        changes: {
          columnId: newColumnId,
        },
      }),
    );

    dispatch(
      updateColumn({
        id: oldColumnId,
        changes: {
          sectionIds: oldSectionIds,
        },
      }),
    );

    dispatch(
      updateColumn({
        id: newColumnId,
        changes: {
          sectionIds: newSectionIds,
        },
      }),
    );

    setColumnIndexInputValue(newColumnIndex);
  };

  // ! BEGIN SECTION JAVASCRIPT ! //

  const resume = useSelector((state) => state.resume);
  const column = columns.byId[section.columnId];

  const [rowIndexInputValue, setRowIndexInputValue] = useState("");

  useEffect(() => {
    const rowIndex = columns.byId[section.columnId].sectionIds.indexOf(
      section.id,
    );
    if (rowIndex >= 0) setRowIndexInputValue(rowIndex);
    else {
      setRowIndexInputValue("?");
      console.error(
        `Invalid Section Row Index.  Column with ID ${section.columnId} not found in columns state.`,
      );
    }
  }, [section.columnId, column.sectionIds, columns.byId, section.id]);

  const updateRowIndex = (action) => {
    let newRowIndex;

    if (action === "increment") newRowIndex = rowIndexInputValue + 1;
    else if (action === "decrement") newRowIndex = rowIndexInputValue - 1;

    if (newRowIndex < 0 || newRowIndex >= column.sectionIds.length) {
      window.alert(
        `Row index must be between 0 and ${column.sectionIds.length - 1}.`,
      );
      return;
    }

    const splicedSectionIds = [...column.sectionIds];
    splicedSectionIds.splice(rowIndexInputValue, 1);
    splicedSectionIds.splice(newRowIndex, 0, section.id);

    dispatch(
      updateColumn({
        id: section.columnId,
        changes: {
          sectionIds: splicedSectionIds,
        },
      }),
    );
    setRowIndexInputValue(newRowIndex);
  };

  const moveSectionUpOrDown = (upOrDown) => {
    const currentSection = sections.byId[section.id];

    const sectionsInColumn = column.sectionIds
      .map((id) => sections.byId[id])
      .filter(Boolean)
      .sort((a, b) => a.position - b.position);

    const currentIndex = sectionsInColumn.findIndex(
      (s) => s.id === currentSection.id,
    );

    if (currentIndex === -1) {
      alert("Could not find this section in the column.");
      return;
    }

    let sectionToSwapWith;

    if (upOrDown === "down")
      sectionToSwapWith = sectionsInColumn[currentIndex + 1];
    else if (upOrDown === "up")
      sectionToSwapWith = sectionsInColumn[currentIndex - 1];

    if (!sectionToSwapWith) {
      alert(`You cannot move this section ${upOrDown} any further.`);
      return;
    }
    dispatch(
      updateSection({
        id: currentSection.id,
        changes: {
          position: sectionToSwapWith.position,
        },
      }),
    );

    dispatch(
      updateSection({
        id: sectionToSwapWith.id,
        changes: {
          position: currentSection.position,
        },
      }),
    );

    setRowIndexInputValue(currentIndex + 1);
    if (upOrDown === "down") updateRowIndex("increment");
    else if (upOrDown === "up") updateRowIndex("decrement");
  };

  return (
    <>
      <div className={styles.toolBarButtonInputWrapper}>
        <div className="flexRow">
          <button
            className="buttonMain"
            onClick={() => moveSectionUpOrDown("up")}
          >
            Up
          </button>
          <button
            className="buttonMain"
            onClick={() => moveSectionUpOrDown("down")}
          >
            Down
          </button>
          <button
            className="buttonMain"
            onClick={() => moveSectionLeftOrRight("left")}
          >
            Left
          </button>
          <button
            className="buttonMain"
            onClick={() => moveSectionLeftOrRight("right")}
          >
            Right
          </button>
        </div>
      </div>
    </>
  );
};

export default MoveSection;