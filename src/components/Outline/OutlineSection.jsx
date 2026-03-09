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
  data,
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

  const handleAddSubsection = (section) => {
    dispatch(
      addSubsection({
        sectionId: section.id,
        subsectionData: {},
      })
    );
  };

  const handleAddField = (sectionId, subsectionId) => {
    dispatch(
      addField({
        sectionId,
        subsectionId,
        fieldData: {
          key: "customField",
          label: "New Field",
          value: [
            {
              type: 'paragraph',
              children: [{ text: '' }]
            }
          ],
        },
      })
    );
  };

  return (
    <>
      {data.subsections?.map((sub, subIndex) => (
        <div
          key={sub.id}
          className={`${styles.subsectionItem} ${styles.subsectionRow}`}
          draggable={true}
          onDragStart={(e) => {
            e.stopPropagation();
            if (dragItem) return;
            setDragItem({
              type: "subsection",
              sectionId: section.id,
              subsectionId: sub.id,
              index: subIndex,
            });
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => {
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
                {data.sectionTitle} {subIndex + 1}
              </span>
            {/* </div> */}
          {/* <div className={styles.dragHandle}>⋮⋮</div>

          <div className={styles.subsectionHeader}>
            <span className={styles.subsectionHeaderSpan}>
              {data.sectionTitle} {subIndex + 1}
            </span> */}

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
            Delete {section.data.sectionTitle} Subsection
          </button>
        </div>
      ))}

      <button
        className={styles.addButton}
        onClick={() => handleAddSubsection(section)}
      >
        + Add {section.data.sectionTitle} Subsection
      </button>
    </>
  );
};

export default OutlineSection;