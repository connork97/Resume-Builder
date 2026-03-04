import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  reorderSections,
  deleteSection,
  addSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
  updateField,
  deleteField,
  reorderFields
} from "../../store/resumeSlice";

import OutlineSection from "./OutlineSection.jsx";
import FieldRow from "./FieldRow.jsx";

import styles from "./Outline.module.css";

const Outline = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.resume.sections);

  const [outlineIsHidden, setOutlineIsHidden] = useState(false);
  const [openSections, setOpenSections] = useState({});

  // Single source of truth for any active drag
  // type: "section" | "subsection" | "field"
  // sectionId: string
  // subsectionId: string | null
  // index: number (position within its parent)

  const [dragItem, setDragItem] = useState(null);

  // const toggleOpen = (id) => {
  //   setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  // };
const toggleOpen = (id) => {
  setOpenSections((prev) => {
    const isCurrentlyOpen = !!prev[id];

    // If clicking an already-open section → close all
    if (isCurrentlyOpen) {
      return {};
    }

    // Otherwise open only this one
    return { [id]: true };
  });
};

  // Section Drag/Reorder Handler

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
        toIndex: index
      })
    );

    setDragItem((prev) => ({ ...prev, index }));
  };

  const handleSectionDragEnd = () => {
    setDragItem(null);
  };

  // Field Change Handler

  const handleFieldChange = (sectionId, subsectionId, fieldId, value) => {
    dispatch(
      updateField({
        sectionId,
        subsectionId,
        fieldId,
        newValue: value
      })
    );
  };

  //  SECTION CONTENT RENDERER

  const renderSectionContent = (section) => {
    const { type, data } = section;

    // Header & Summary
    // if (type === "header" || type === "summary") {
    //   return (
    //     <div className={styles.sectionContent}>
    //       {data.fields?.map((field, fieldIndex) =>
    //         renderFieldRow(section.id, null, field, fieldIndex)
    //       )}
    //     </div>
    //   );
    // }

    // Sections with Subsections
    return (
      <OutlineSection
        dispatch={dispatch}
        data={data}
        section={section}
        dragItem={dragItem}
        setDragItem={setDragItem}
        renderFieldRow={renderFieldRow}
      />
    )
  };

  // FIELD ROW RENDERER

  const renderFieldRow = (
    sectionId,
    subsectionId, // null for header/summary
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

  // MAIN RENDER

  return (
    <div
      className={`${styles.outlineWrapper} ${
        outlineIsHidden ? styles.hidden : styles.visible
      }`}
    >
        <button
          className={!outlineIsHidden ? styles.hideOutlineButton : styles.showOutlineButton}
          onClick={() => setOutlineIsHidden(!outlineIsHidden)}
        >
          {!outlineIsHidden ? '⟨⟨⟨' : '⟩⟩⟩'}
        </button>


      {
        <div className={styles.outlineContainer}>
          <h1 className={styles.outlineTitle}>Resume Outline</h1>

      {!sections.length ? <h2>No Sections to Display</h2> : sections.map((section, index) => (
        <div
          key={section.id}
          className={`${styles.sectionBlock} ${styles.sectionRow}`}
          draggable={true}
          onDragStart={(e) => handleSectionDragStart(e, index, section.id)}
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
              className={styles.dropdownButton}
              onClick={() => toggleOpen(section.id)}
            >
              ▾
            </button>
          </div>

          {openSections[section.id] && (
            <div className={styles.sectionContent}>
              {renderSectionContent(section)}

              <button
                className={styles.deleteSectionButton}
                onClick={() => dispatch(deleteSection(section.id))}
              >
                Delete Section
              </button>
            </div>
          )}
        </div>
      ))}
        </div>
      }
    </div>
  );
};

export default Outline;