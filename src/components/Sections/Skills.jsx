import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import styles from "./Skills.module.css";
import "./Sections.css";

const Skills = ({ id, data }) => {
  const dispatch = useDispatch();

  const handleFieldChange = (subId, fieldId, value) => {
    dispatch(
      updateField({
        sectionId: id,
        subsectionId: subId,
        fieldId,
        newValue: value
      })
    );
  };

  return (
    <div className="sectionContainerDiv">
      <div className="sectionTitle">{data.sectionTitle}</div>

      <div className={styles.skillsInputFlexWrapper}>
        {data.subsections?.map((sub) => (
          <div key={sub.id} className={styles.skillRow}>
            {sub.fields?.map((field) => (
              <input
                key={field.id}
                className="sectionInput"
                type="text"
                placeholder={field.label}
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(sub.id, field.id, e.target.value)
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;