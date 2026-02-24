import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Skills.module.css";

const Skills = ({ id, data }) => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(
      updateSection({
        id,
        changes: {
          data: {
            ...data,
            skills: value
          }
        }
      })
    );
  };

  return (
    <div className={styles.skillsSection}>
      <textarea
        className={styles.textarea}
        placeholder="List your skills (e.g., JavaScript, React, CSS, Redux)"
        value={data.skills}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Skills;