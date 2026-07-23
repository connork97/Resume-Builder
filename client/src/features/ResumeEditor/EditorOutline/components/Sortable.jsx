import { useSortable } from "@dnd-kit/react/sortable";
import React, { useEffect } from "react";

import styles from "../Outline.module.css";
import OutlineSection from "./OutlineSection";
import { useDispatch } from "react-redux";

const Sortable = ({
  id,
  index,
  getNodeString,
  getSectionById,
  sectionId,
  toggleSection,
  collapsedSections,
  dragItem,
  setDragItem,
  renderFieldRow,
}) => {
  const { ref } = useSortable({ id, index });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("id", id, "index", index);
  }, [index]);
  return (
    <div ref={ref}
      className={`${styles.sectionBlock} ${styles.sectionRow}`}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.dragHandle}>⋮⋮</div>

        <div className={styles.sectionTitle}>
          {getNodeString(getSectionById(sectionId).value[0])}{" "}
          {/* Gets the plain text of the Slate Field Value */}
        </div>

        <button
          className={styles.collapseButton}
          onClick={() => toggleSection(sectionId)}
        >
          ▼
        </button>
      </div>
      {!(collapsedSections[sectionId] ?? true) && (
        <div className={styles.sectionContent}>
          <OutlineSection
            dispatch={dispatch}
            section={getSectionById(sectionId)}
            sectionTitle={getNodeString(getSectionById(sectionId).value[0])}
            dragItem={dragItem}
            setDragItem={setDragItem}
            renderFieldRow={renderFieldRow}
          />

          <button
            className={styles.deleteSectionButton}
            onClick={() => handleDeleteSection(sectionId)}
          >
            Delete Section
          </button>
        </div>
      )}
    </div>
  );
};
{
  /* // <li ref={ref}>Item {index}</li> */
}

export default Sortable;
