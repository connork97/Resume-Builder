import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Skills.module.css";
import "./Sections.css";

const Skills = ({ id, data }) => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(
      updateSection({
        id,
        changes: {
          data: {
            ...data,
            content: value
          }
        }
      })
    );
  };


  // Update a specific subsection (skill)
  const handleSubsectionChange = (subId, field, value) => {
    const updated = data.subsections.map((sub) =>
      sub.id === subId ? { ...sub, [field]: value} : sub
    );

    dispatch(
      updateSection({
        id,
        changes: {
          data: {
            ...data,
            subsections: updated
          }
        }
      })
    );
  };

  return (
    <div className="sectionContainerDiv">
      <div className="sectionTitle">{data.sectionTitle}</div>
      <div className={styles.skillsInputFlexWrapper}>
      {data.subsections.map((sub) => (
          <input
            // key={sub.id}
            className="sectionInput"
            type="text"
            placeholder="Skill"
            value={sub.skill}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "skill", e.target.value)
            }
          />
        ))}
        </div>
          
          
      {/* <textarea
        className="sectionTextArea"
        placeholder="List your skills (e.g., JavaScript, React, CSS, Redux)"
        value={data.content}
        onChange={(e) => handleChange(e.target.value)}
      /> */}
    </div>
  );
};

export default Skills;