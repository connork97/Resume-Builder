import { useSelector, useDispatch } from "react-redux";
import {
  reorderSections,
  addSubsection,
  removeSubsection,
  reorderSubsections,
  toggleField
} from "../../store/resumeSlice";
import styles from "./Outline.module.css";

const Outline = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.resume.sections);

  const handleMoveSection = (from, to) => {
    dispatch(reorderSections({ fromIndex: from, toIndex: to }));
  };

  const handleMoveSubsection = (sectionId, from, to) => {
    dispatch(reorderSubsections({ sectionId, fromIndex: from, toIndex: to }));
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

  return (
    <div className={styles.outlineContainer}>
      <div className={styles.title}>Resume Outline</div>

      {sections.map((section, i) => (
        <div key={section.id} className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span>{section.data.sectionTitle}</span>

            <div className={styles.sectionControls}>
              {i > 0 && (
                <button className={styles.outlineButton} onClick={() => handleMoveSection(i, i - 1)}>↑</button>
              )}
              {i < sections.length - 1 && (
                <button className={styles.outlineButton} onClick={() => handleMoveSection(i, i + 1)}>↓</button>
              )}
            </div>
          </div>

          {/* Subsections */}
          {section.data.subsections && (
            <div className={styles.subsectionList}>
              {section.data.subsections.map((sub, j) => (
                <div key={sub.id} className={styles.subsectionItem}>
                  <span>
                    {section.type === "workHistory" && (sub.jobTitle || "Job")}
                    {section.type === "education" && (sub.school || "School")}
                  </span>

                  <div className={styles.subsectionControls}>
                    {j > 0 && (
                      <button
                        className={styles.outlineButton}
                        onClick={() =>
                          handleMoveSubsection(section.id, j, j - 1)
                        }
                      >
                        ↑
                      </button>
                    )}
                    {j < section.data.subsections.length - 1 && (
                      <button
                        className={styles.outlineButton}
                        onClick={() =>
                          handleMoveSubsection(section.id, j, j + 1)
                        }
                      >
                        ↓
                      </button>
                    )}
                    <button
                      className={styles.outlineButton}
                      onClick={() =>
                        dispatch(
                          removeSubsection({
                            sectionId: section.id,
                            subsectionId: sub.id
                          })
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <button
                className={`${styles.addButton} ${styles.outlineButton}`}
                onClick={() => handleAddSubsection(section)}
              >
                + Add Entry
              </button>
            </div>
          )}

          {/* Field toggles (Contact, etc.) */}
          {section.data.hiddenFields && (
            <div className={styles.fieldToggleList}>
              {Object.keys(section.data.hiddenFields).map((field) => (
                <label key={field} className={styles.fieldToggle}>
                  <input
                    type="checkbox"
                    checked={!section.data.hiddenFields[field]}
                    onChange={() =>
                      dispatch(
                        toggleField({ sectionId: section.id, field })
                      )
                    }
                  />
                  {field}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Outline;