import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reorderSections, deleteSection, updateFieldValue } from '@/store/resumeSlice.js';

import OutlineSection from "./components/OutlineSection.jsx";
import FieldRow from "./components/FieldRow.jsx";

import styles from "./Outline.module.css";
import { Node } from "slate";
import { deleteSectionFromApi } from "@/services/resumeServices.js";

const Outline = () => {
  const dispatch = useDispatch();
  const resume = useSelector(state => state.resume);
  const sections = resume.sections;
  // const sections = useSelector((state) => state.resume.sections);

  const [outlineIsHidden, setOutlineIsHidden] = useState(true);

  // Collapse state for SECTIONS
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Drag state
  const [dragItem, setDragItem] = useState(null);

  const handleSectionDragStart = (e, index, sectionId) => {
    if (dragItem) return;
    setDragItem({ type: "section", sectionId, index });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSectionDragOver = (e, index) => {
    if (!dragItem || dragItem.type !== "section") return;
    e.preventDefault();
    if (dragItem.index === index) return;

    dispatch(
      reorderSections({
        fromIndex: dragItem.index,
        toIndex: index,
      })
    );

    setDragItem((prev) => ({ ...prev, index }));
  };

  const handleSectionDragEnd = () => {
    setDragItem(null);
  };

  // const handleFieldChange = (fieldId, value) => {
  //   dispatch(
  //     updateFieldValue({
  //       fieldId,
  //       newValue: value,
  //     })
  //   );
  // };

  const renderFieldRow = (
    sectionId,
    subsectionId,
    fieldId,
    fieldIndex
  ) => {
    const isHeaderOrSummary = subsectionId === null;

    return (
      <FieldRow
        key={fieldId}
        fieldId={fieldId}
        fieldIndex={fieldIndex}
        sectionId={sectionId}
        subsectionId={subsectionId}
        // handleFieldChange={handleFieldChange}
        isHeaderOrSummary={isHeaderOrSummary}
        dragItem={dragItem}
        setDragItem={setDragItem}
      />
    );
  };

  const getSectionById = (sectionId) => {
    return sections.byId[sectionId]
  }

  const handleDeleteSection = async (sectionId) => {
    const section = getSectionById(sectionId);
    const sectionTitle = getNodeString(section.value[0]);
    const sectionLabel = sectionTitle || 'this';
    if (!confirm(`Are you sure you want to delete the entire ${sectionTitle} section?`)) {
      return;
    }

    const autoSave = false;

    if (autoSave) {
      const sectionIsDeleted = await deleteSectionFromApi(sectionId);
      if (!sectionIsDeleted) {
        return;
      }
    }
    dispatch(deleteSection(sectionId));
}

const getNodeString = (slateValue) => {
  return Node.string(slateValue);
}

useEffect(() => {
  if (!sections.allIds.length) return;

  const initial = {};
  sections.allIds.forEach(id => {
    initial[id] = true;
  });

  setCollapsedSections(initial);
}, [sections.allIds]);

return (
  <div
    className={`${styles.outlineWrapper} ${outlineIsHidden ? styles.hidden : styles.visible
      }`}
  >
    <div className={styles.outlineContainer}>
      <div className={styles.outlineTitle}>Resume Outline</div>

      <button
        className={
          !outlineIsHidden
            ? styles.hideOutlineButton
            : styles.showOutlineButton
        }
        onClick={() => setOutlineIsHidden(!outlineIsHidden)}
      >
        {!outlineIsHidden ? "⟨⟨⟨" : "⟩⟩⟩"}
      </button>

      {!sections.allIds.length ? (
        <h2>No Sections to Display</h2>
      ) : (
        sections.allIds.map((sectionId, index) => (
          <div
            key={sectionId}
            className={`${styles.sectionBlock} ${styles.sectionRow}`}
            draggable={true}
            onDragStart={(e) =>
              handleSectionDragStart(e, index, sectionId)
            }
            onDragOver={(e) => handleSectionDragOver(e, index)}
            onDragEnd={handleSectionDragEnd}
            onDrop={() => setDragItem(null)}
          >
            <div className={styles.sectionHeader}>
              <div className={styles.dragHandle}>⋮⋮</div>

              <div className={styles.sectionTitle}>
                {getNodeString(getSectionById(sectionId).value[0])}  {/* Gets the plain text of the Slate Field Value */}
              </div>

              <button
                className={styles.collapseButton}
                onClick={() => toggleSection(sectionId)}
              >
                ▼
                {/* {collapsedSections[sectionId] ? "▼" : "▲"} */}
                {/* ◀ */}
                {/* {collapsedSections[sectionId] ? "▼" : "▶"} */}

              </button>
            </div>

            {!collapsedSections[sectionId] && (
              <div className={styles.sectionContent}>
                <OutlineSection
                  dispatch={dispatch}
                  section={sections.byId[sectionId]}
                  sectionTitle={getNodeString(sections.byId[sectionId].value[0])}
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
        ))
      )}
    </div>
  </div>
);
};

export default Outline;