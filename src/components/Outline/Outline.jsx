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

  const [openSections, setOpenSections] = useState({});
  const [draggingSection, setDraggingSection] = useState(null);

  const toggleOpen = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  //  Section Reording by User Drag
  const handleDragStart = (e, index) => {
    setDraggingSection(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingSection === index) return;

    dispatch(
      reorderSections({
        fromIndex: draggingSection,
        toIndex: index
      })
    );
    setDraggingSection(index);
  };

  const handleDragEnd = () => {
    setDraggingSection(null);
  };

  //  Subsection Field Editing
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

  //  Add Subsections
  const handleAddSubsection = (section) => {
    dispatch(
      addSubsection({
        sectionId: section.id,
        subsectionData: {} // resumeSlice fills in default fields
      })
    );
  };

  //  Add Fields to Subsections
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

  //  Render Sections and their Content
  const renderSectionContent = (section) => {
    const { type, data } = section;

    //  HEADER & SUMMARY (No Subsections)
    if (type === "header" || type === "summary") {
      return (
        <div className={styles.subsectionFields}>
          {data.fields?.map((field) => (
            <input
              key={field.id}
              className={styles.subInput}
              value={field.value}
              placeholder={field.label}
              onChange={(e) =>
                handleFieldChange(section.id, null, field.id, e.target.value)
              }
            />
          ))}
        </div>
      );
    }

    //  Work History, Education, Skills, Contact (Sections including Subsections)
    return (
      <>
        {data.subsections?.map((sub) => (
          <div key={sub.id} className={styles.subsectionItem}>
            <div className={styles.subsectionFields}>
              {sub.fields?.map((field) => (
                <input
                  key={field.id}
                  className={styles.subInput}
                  value={field.value}
                  placeholder={field.label}
                  onChange={(e) =>
                    handleFieldChange(
                      section.id,
                      sub.id,
                      field.id,
                      e.target.value
                    )
                  }
                />
              ))}

              {/* Add Field Button */}
              <button
                className={styles.addButton}
                onClick={() => handleAddField(section.id, sub.id)}
              >
                + Add Field
              </button>
            </div>

            {/* Delete Subsection */}
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
              ✕
            </button>
          </div>
        ))}

        {/* Add Subsection */}
        <button
          className={styles.addButton}
          onClick={() => handleAddSubsection(section)}
        >
          + Add {section.data.sectionTitle} Subsection
        </button>
      </>
    );
  };

  //  Main Render
  return (
    <div className={styles.outlineContainer}>
      <div className={styles.title}>Resume Outline</div>

      {sections.map((section, index) => (
        <div
          key={section.id}
          className={styles.sectionBlock}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
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
  );
};

export default Outline;