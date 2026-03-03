import { useState } from "react";
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

  // Add Subsection and Add Field Function Handlers

  const handleAddSubsection = (section) => {
    dispatch(
      addSubsection({
        sectionId: section.id,
        subsectionData: {}
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
          value: ""
        }
      })
    );
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
      <div
        key={field.id}
        className={`${styles.fieldInputRow} ${styles.fieldRow}`}
        draggable={true}
        onDragStart={(e) => {
          e.stopPropagation();
          if (dragItem) return;
          setDragItem({
            type: "field",
            sectionId,
            subsectionId,
            index: fieldIndex
          });
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(e) => {
          e.stopPropagation();
          if (!dragItem || dragItem.type !== "field") return;
          e.preventDefault();

          // Only reorder fields within the same section + same subsection (or same "no subsection" group)
          if (
            dragItem.sectionId !== sectionId ||
            dragItem.subsectionId !== subsectionId
          ) {
            return;
          }

          if (dragItem.index === fieldIndex) return;

          dispatch(
            reorderFields({
              sectionId,
              subsectionId: isHeaderOrSummary ? null : subsectionId,
              fromIndex: dragItem.index,
              toIndex: fieldIndex
            })
          );

          setDragItem((prev) => ({ ...prev, index: fieldIndex }));
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
        <div className={styles.dragHandle}>⋮⋮</div>

        <input
          className={styles.subInput}
          value={field.value}
          placeholder={field.label}
          onChange={(e) =>
            handleFieldChange(sectionId, subsectionId, field.id, e.target.value)
          }
        />

        <button
          className={styles.deleteButton}
          onClick={() =>
            dispatch(
              deleteField({
                sectionId,
                subsectionId,
                fieldId: field.id
              })
            )
          }
        >
          ✕
        </button>
      </div>
    );
  };

  //  SECTION CONTENT RENDERER

  const renderSectionContent = (section) => {
    const { type, data } = section;

    // Header & Summary
    if (type === "header" || type === "summary") {
      return (
        <div className={styles.sectionContent}>
          {data.fields?.map((field, fieldIndex) =>
            renderFieldRow(section.id, null, field, fieldIndex)
          )}
        </div>
      );
    }

    // Sections with Subsections
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
                index: subIndex
              });
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.stopPropagation();
              if (!dragItem || dragItem.type !== "subsection") return;
              e.preventDefault();

              // Only reorder subsections within the same section
              if (dragItem.sectionId !== section.id) return;
              if (dragItem.index === subIndex) return;

              dispatch(
                reorderSubsections({
                  sectionId: section.id,
                  fromIndex: dragItem.index,
                  toIndex: subIndex
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
              <span className={styles.subsectionHeaderSpan}>{data.sectionTitle} {subIndex + 1}</span>
            </div>

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

            <button
              className={styles.deleteButton}
              onClick={() =>
                dispatch(
                  deleteSubsection({
                    sectionId: section.id,
                    subsectionId: sub.id
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

      {!sections.length ? <h2>No Sections to </h2> : sections.map((section, index) => (
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