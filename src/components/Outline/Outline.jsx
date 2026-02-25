import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  reorderSections,
  deleteSection,
  addSubsection,
  deleteSubsection,
  reorderSubsections,
  updateSection
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

  // SECTION DRAGGING
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

  // SUBSECTION EDITING
  const handleSubChange = (sectionId, subId, field, value) => {
    const section = sections.find((s) => s.id === sectionId);
    const updated = section.data.subsections.map((sub) =>
      sub.id === subId ? { ...sub, [field]: value } : sub
    );

    dispatch(
      updateSection({
        id: sectionId,
        changes: {
          data: {
            ...section.data,
            subsections: updated
          }
        }
      })
    );
  };

  const handleAddSubsection = (section) => {
    const type = section.type;

    const defaultSubsection = {
      workHistory: {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: ""
      },
      education: {
        school: "",
        degree: "",
        field: "",
        location: "",
        startYear: "",
        endYear: "",
        description: ""
      },
      skills: {
        skill: ""
      }
    }[type];

    if (!defaultSubsection) return;

    dispatch(
      addSubsection({
        sectionId: section.id,
        subsectionData: defaultSubsection
      })
    );
  };

  // RENDERERS FOR EACH SECTION TYPE
  const renderSectionContent = (section) => {
    const { type, data } = section;

    // HEADER
    if (type === "header") {
      return (
        <div className={styles.subsectionFields}>
          <input
            className={styles.subInput}
            value={data.name}
            placeholder="Name"
            onChange={(e) =>
              dispatch(
                updateSection({
                  id: section.id,
                  changes: { data: { ...data, name: e.target.value } }
                })
              )
            }
          />
          <input
            className={styles.subInput}
            value={data.title}
            placeholder="Title"
            onChange={(e) =>
              dispatch(
                updateSection({
                  id: section.id,
                  changes: { data: { ...data, title: e.target.value } }
                })
              )
            }
          />
        </div>
      );
    }

    // CONTACT
    if (type === "contact") {
      return (
        <div className={styles.subsectionFields}>
          {Object.keys(data)
            .filter((field) => field !== "sectionTitle" && field !== "subsections")
            .map((field) => (
              <input
                key={field}
                className={styles.subInput}
                value={data[field]}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={(e) =>
                  dispatch(
                    updateSection({
                      id: section.id,
                      changes: {
                        data: { ...data, [field]: e.target.value }
                      }
                    })
                  )
                }
              />
            ))}
        </div>
      );
    }

    // SUMMARY AND SKILLS (with skills still being one singular string, not an array of strings)
   //  if (type === "summary" || type === "skills") {
   if (type === "summary") {
      return (
        <textarea
          className={styles.subInput}
          value={data.content}
          placeholder={type.charAt(0).toUpperCase() + type.slice(1)}
          onChange={(e) =>
            dispatch(
              updateSection({
                id: section.id,
                changes: { data: { ...data, content: e.target.value } }
              })
            )
          }
        />
      );
    }

    // SKILLS
   //  if (type === "skills") {
   //    return (
   //      <div className={styles.subsectionFields}>
   //        {data.skillsArr.map((skill, i) => (
   //          <div key={i} className={styles.subsectionItem}>
   //            <input
   //              className={styles.subInput}
   //              value={skill}
   //              placeholder="Skill"
   //              onChange={(e) => {
   //                const updated = [...data.skillsArr];
   //                updated[i] = e.target.value;
   //                dispatch(
   //                  updateSection({
   //                    id: section.id,
   //                    changes: { data: { ...data, skillsArr: updated } }
   //                  })
   //                );
   //              }}
   //            />
   //            <button
   //              className={styles.deleteButton}
   //              onClick={() => {
   //                const updated = data.skillsArr.filter((_, idx) => idx !== i);
   //                dispatch(
   //                  updateSection({
   //                    id: section.id,
   //                    changes: { data: { ...data, skillsArr: updated } }
   //                  })
   //                );
   //              }}
   //            >
   //              ✕
   //            </button>
   //          </div>
   //        ))}

   //        <button
   //          className={styles.addButton}
   //          onClick={() =>
   //            dispatch(
   //              updateSection({
   //                id: section.id,
   //                changes: {
   //                  data: {
   //                    ...data,
   //                    skillsArr: [...data.skillsArr, ""]
   //                  }
   //                }
   //              })
   //            )
   //          }
   //        >
   //          + Add Skill
   //        </button>
   //      </div>
   //    );
   //  }

    // WORK HISTORY / EDUCATION (subsections)
    return (
      <>
        {data.subsections?.map((sub) => (
          <div key={sub.id} className={styles.subsectionItem}>
            <div className={styles.subsectionFields}>
              {Object.keys(sub)
                .filter((field) => field !== "id")
                .map((field) => (
                  <input
                    key={field}
                    className={styles.subInput}
                    value={sub[field]}
                    placeholder={field}
                    onChange={(e) =>
                      handleSubChange(section.id, sub.id, field, e.target.value)
                    }
                  />
                ))}
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
              ✕
            </button>
          </div>
        ))}

        <button
          className={styles.addButton}
          onClick={() => handleAddSubsection(section)}
        >
          + Add Entry
        </button>
      </>
    );
  };

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