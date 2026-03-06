import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  reorderSections,
  deleteSection,
  updateField,
} from "../../store/resumeSlice";

import OutlineSection from "./OutlineSection.jsx";
import FieldRow from "./FieldRow.jsx";

import styles from "./Outline.module.css";

const Outline = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.resume.sections);

  const [outlineIsHidden, setOutlineIsHidden] = useState(false);

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

  const handleFieldChange = (sectionId, subsectionId, fieldId, value) => {
    dispatch(
      updateField({
        sectionId,
        subsectionId,
        fieldId,
        newValue: value,
      })
    );
  };

  const renderFieldRow = (
    sectionId,
    subsectionId,
    field,
    fieldIndex
  ) => {
    const isHeaderOrSummary = subsectionId === null;

    return (
      <FieldRow
        key={field.id}
        dispatch={dispatch}
        field={field}
        fieldIndex={fieldIndex}
        sectionId={sectionId}
        subsectionId={subsectionId}
        handleFieldChange={handleFieldChange}
        isHeaderOrSummary={isHeaderOrSummary}
        dragItem={dragItem}
        setDragItem={setDragItem}
      />
    );
  };

  return (
    <div
      className={`${styles.outlineWrapper} ${
        outlineIsHidden ? styles.hidden : styles.visible
      }`}
    >

      <div className={styles.outlineContainer}>
        <div className={styles.outlineTitle}>Resume Outline
        </div>
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

        {!sections.length ? (
          <h2>No Sections to Display</h2>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className={`${styles.sectionBlock} ${styles.sectionRow}`}
              draggable={true}
              onDragStart={(e) =>
                handleSectionDragStart(e, index, section.id)
              }
              onDragOver={(e) => handleSectionDragOver(e, index)}
              onDragEnd={handleSectionDragEnd}
              onDrop={() => setDragItem(null)}
            >
              <div className={styles.sectionHeader}>
                <div className={styles.dragHandle}>⋮⋮</div>

                <div className={styles.sectionTitle}>
                  {section.data.sectionTitle}
                </div>

                <button
                  className={styles.collapseButton}
                  onClick={() => toggleSection(section.id)}
                >
                  {/* {collapsedSections[section.id] ? "▶" : "▼"} */}
                  ▼
                </button>
              </div>

              {!collapsedSections[section.id] && (
                <div className={styles.sectionContent}>
                  <OutlineSection
                    dispatch={dispatch}
                    data={section.data}
                    section={section}
                    dragItem={dragItem}
                    setDragItem={setDragItem}
                    renderFieldRow={renderFieldRow}
                  />

                  <button
                    className={styles.deleteSectionButton}
                    onClick={() => dispatch(deleteSection(section.id))}
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