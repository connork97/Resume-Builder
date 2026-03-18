import React, { useState } from "react";
import {
  addSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
} from "../../store/resumeSlice";

import styles from "./Outline.module.css";

const OutlineSection = ({
  dispatch,
  section,
  dragItem,
  setDragItem,
  renderFieldRow,
}) => {

  // Collapse state for SUBSECTIONS
  const [collapsedSubsections, setCollapsedSubsections] = useState({});

  const toggleSubsection = (subId) => {
    setCollapsedSubsections((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleAddSubsection = () => {
    dispatch(addSubsection({ sectionId: section.id }));
  };

  const handleAddField = (sectionId, subsectionId) => {
    dispatch(addField({ sectionId, subsectionId }));
  };

  const handleOnDragStart = (e, subIndex, subId) => {
    e.stopPropagation();
    if (dragItem) return;
    setDragItem({
      type: "subsection",
      sectionId: section.id,
      subsectionId: sub.id,
      index: subIndex,
    });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleOnDragOver = (e, subIndex) => {
    e.stopPropagation();
    if (!dragItem || dragItem.type !== "subsection") return;
    e.preventDefault();

    if (dragItem.sectionId !== section.id) return;
    if (dragItem.index === subIndex) return;

    dispatch(
      reorderSubsections({
        sectionId: section.id,
        fromIndex: dragItem.index,
        toIndex: subIndex,
      })
    );

    setDragItem((prev) => ({ ...prev, index: subIndex }));
    //     e.stopPropagation();
    // if (!dragItem || dragItem.type !== "subsection") return;
    // e.preventDefault();

    // if (dragItem.sectionId !== section.id) return;
    // if (dragItem.index === subIndex) return;

    // dispatch(
    //   reorderSubsections({
    //     sectionId: section.id,
    //     fromIndex: dragItem.index,
    //     toIndex: subIndex,
    //   })
    // );

    // setDragItem((prev) => ({ ...prev, index: subIndex }));
  }
  return (
    <>
      {/* {data.subsections?.map((sub, subIndex) => ( */}
      {section.subsections?.map((sub, subIndex) => (
        <div
          key={sub.id}
          className={`${styles.subsectionItem} ${styles.subsectionRow}`}
          draggable={true}
          onDragStart={(e) => {
            handleOnDragStart(e, subIndex, sub.id)
          }}

          onDragOver={(e) => {
            handleOnDragOver(e, subIndex)

          }}
          onDragEnd={(e) => {
            e.stopPropagation();
            setDragItem(null);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            setDragItem(null);
          }}
        >
          <div className={styles.dragHandle}>⋮⋮
            <span className={styles.subsectionHeaderSpan}>
              {section.label} {subIndex + 1}
            </span>
            {/* </div> */}
            {/* <div className={styles.dragHandle}>⋮⋮</div> */}

          {/* <div className={styles.subsectionHeader}>
            <span className={styles.subsectionHeaderSpan}>
              {section.label} {subIndex + 1}
            </span>
            </div> */}

            <button
              className={styles.collapseButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleSubsection(sub.id);
              }}
            >
              {/* {collapsedSubsections[sub.id] ? "▼" : "▶"} */}
              ▼
            </button>
          </div>

          {!collapsedSubsections[sub.id] && (
            <div className={styles.subsectionFields}>
              {sub.fields?.map((field, fieldIndex) =>
                renderFieldRow(section.id, sub.id, field, fieldIndex)
              )}

              <button
                className={`${styles.addButton} ${styles.addFieldButton}`}
                onClick={() => handleAddField(section.id, sub.id)}
              >
                + Add Field
              </button>
            </div>
          )}

          <button
            className={styles.deleteButton}
            onClick={() =>
              dispatch(
                deleteSubsection({
                  sectionId: section.id,
                  subsectionId: sub.id,
                })
              )
            }
          >
            Delete {section.label} Subsection
            {/* Delete {section.data.sectionTitle} Subsection */}
          </button>
        </div>
      ))}

      <button
        className={styles.addButton}
        onClick={handleAddSubsection}
      >
        + Add {section.label} Subsection
        {/* + Add {section.data.sectionTitle} Subsection */}
      </button>
    </>
  );
};

export default OutlineSection;