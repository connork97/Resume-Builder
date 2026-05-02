import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import {
  addSubsection,
  updateSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
  setResume,
} from "@/store/resumeSlice";

import styles from "./Outline.module.css";
import { BASE_URL } from "@/config";
import normalizeResumeFromApi from "@/utils/normalizeResumeFromApi";

const OutlineSection = ({
  dispatch,
  section,
  sectionTitle,
  dragItem,
  setDragItem,
  renderFieldRow,
}) => {

  const subsections = useSelector(state => state.resume.subsections);

  // Collapse state for SUBSECTIONS
  const [collapsedSubsections, setCollapsedSubsections] = useState({});

  const toggleSubsection = (subsectionId) => {
    setCollapsedSubsections((prev) => ({
      ...prev,
      [subsectionId]: !prev[subsectionId],
    }));
  };

  const handleAddSubsection = async () => {
    try {

      const response = await fetch(`${BASE_URL}/subsections/${section.id}`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json();
      if (!response.ok) {
        throw data?.error;
      }
      const normalizedResume = normalizeResumeFromApi(data);
      dispatch(setResume(normalizedResume));
    } catch (error) {
      console.error(error);
      alert(
        error?.code && error?.message
          ? error.code + '\n' + error.message
          : `Error adding subsection to section of ID ${section.id}.`
      )
    }
  };

  const handleAddField = async (subsectionId) => {
    try {
      const response = await fetch(`${BASE_URL}/fields/${subsectionId}`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json();
      if (!response.ok) {
        throw data?.error;
      }
      const normalizedResume = normalizeResumeFromApi(data);
      dispatch(setResume(normalizedResume));
    } catch (error) {
      console.error(error);
      alert(
        error?.code && error?.message
          ? error.code + '\n' + error.message
          : `An error occurred while trying to add a field to subsection of ID ${subsectionId}.`
      )
    }
  };

  const handleOnDragStart = (e, subIndex, subsectionId) => {
    e.stopPropagation();
    if (dragItem) return;
    setDragItem({
      type: "subsection",
      sectionId: section.id,
      subsectionId: subsectionId,
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
  }

  const getSubsectionById = (subsectionId) => {
    return subsections.byId[subsectionId];
  }

  const handleDeleteSubsection = async (subId, subIndex) => {
    if (!confirm(`Are you sure you want to delete the ${sectionTitle} subsection at index ${subIndex}?`)) {
      return;
    }
    dispatch(deleteSubsection(subId));
    // try {
    // const response = await fetch(`${BASE_URL}/subsections/${subId}`, {
    //   method: 'DELETE',
    //   credentials: 'include',
    // })
    // const data = await response.json();
    // if (!response.ok) {
    //   throw data?.error;
    // }
    // const normalizedResume = normalizeResumeFromApi(data);
    // dispatch(setResume(normalizedResume));
    // } catch (error) {
    // console.error(error);
    // alert(
    // error?.code && error?.message
    // ? error.code + '\n' + error.message
    // : `An error occurred while trying to delete the ${sectionTitle} subsection at index ${subIndex}.`
    // )
    // }
  }

  useEffect(() => {
    if (!section.subsectionIds?.length) return;

    setCollapsedSubsections(prev => {
      const updated = { ...prev };

      section.subsectionIds.forEach(id => {
        if (!(id in updated)) {
          updated[id] = true; // collapsed by default
        }
      });

      return updated;
    });
  }, [section.subsectionIds]);

const moveSubsectionUpOrDown = (upOrDown, subsectionId, subsectionIndex) => {
  const currentSubsection = subsections.byId[subsectionId];

  const subsectionsInSection = section.subsectionIds
    .map(id => subsections.byId[id])
    .filter(Boolean)
    .sort((a, b) => a.position - b.position);

  if (!currentSubsection) {
    console.error(`Subsection ${subsectionId} not found.`);
    return;
  }

  let targetIndex;

  if (upOrDown === 'down') {
    targetIndex = subsectionIndex + 1;
  } else if (upOrDown === 'up') {
    targetIndex = subsectionIndex - 1;
  }

  const subsectionToSwapWith = subsectionsInSection[targetIndex];

  if (!subsectionToSwapWith) {
    alert(`You cannot move this subsection ${upOrDown} any further.`);
    return;
  }

  // Swap positions
  dispatch(updateSubsection({
    subsectionId: currentSubsection.id,
    changes: {
      position: subsectionToSwapWith.position,
    },
  }));

  dispatch(updateSubsection({
    subsectionId: subsectionToSwapWith.id,
    changes: {
      position: currentSubsection.position,
    },
  }));
};

  return (
    <>
      {section.subsectionIds?.map((subId, subIndex) => {
        const subsection = getSubsectionById(subId);
        return (
          <div
            key={subId}
            className={`${styles.subsectionItem} ${styles.subsectionRow}`}
            draggable={true}
            onDragStart={(e) => {
              handleOnDragStart(e, subIndex, subId)
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
            {/* <div className={styles.dragHandle}> */}
            <div className={styles.subsectionHeaderRowWrapper}>
              <div className={styles.upArrowDownArrowWrapper}>
                <span
                  className={styles.upOrDownArrow}
                  onClick={() => moveSubsectionUpOrDown('up', subId, subIndex)}
                >
                  ▲
                </span>
                <span
                  className={styles.upOrDownArrow}
                  onClick={() => moveSubsectionUpOrDown('down', subId, subIndex)}
                >
                  ▼
                </span>
              </div>
              {/* ⋮⋮ */}
              <span className={styles.subsectionHeaderSpan}>
                {sectionTitle} {subIndex + 1}
              </span>

              <button
                className={styles.collapseButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubsection(subId);
                }}
              >
                {/* {collapsedSubsections[subId] ? "▼" : "▲"} */}
                ▼
              </button>
            </div>

            {!collapsedSubsections[subId] && (
              <div className={styles.subsectionFields}>
                {subsection.fieldIds?.map((fieldId, fieldIndex) => {
                  return renderFieldRow(section.id, subId, fieldId, fieldIndex)
                }
                )}

                <button
                  className={`${styles.addButton} ${styles.addFieldButton}`}
                  onClick={() => handleAddField(subId)}
                >
                  + Add Field
                </button>
              </div>
            )}

            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteSubsection(subId, subIndex)}
            // onClick={() =>
            // dispatch(
            //   deleteSubsection({
            //     sectionId: section.id,
            //     subsectionId: subsectionId,
            //   })
            // )
            // }
            >
              Delete {sectionTitle} Subsection
            </button>
          </div>
        )
      })}

      <button
        className={styles.addButton}
        onClick={handleAddSubsection}
      >
        + Add {section.label} Subsection
      </button>
    </>
  );
};

export default OutlineSection;