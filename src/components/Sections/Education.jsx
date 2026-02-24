import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Education.module.css";

const Education = ({ id, data }) => {
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(
      updateSection({
        id,
        changes: {
          data: {
            ...data,
            [field]: value
          }
        }
      })
    );
  };

  return (
    <div className={styles.educationSection}>
      <input
        className={styles.input}
        type="text"
        placeholder="School Name"
        value={data.school}
        onChange={(e) => handleChange("school", e.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Degree"
        value={data.degree}
        onChange={(e) => handleChange("degree", e.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Field of Study"
        value={data.field}
        onChange={(e) => handleChange("field", e.target.value)}
      />

      <div className={styles.dateRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Start Year"
          value={data.startYear}
          onChange={(e) => handleChange("startYear", e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="End Year"
          value={data.endYear}
          onChange={(e) => handleChange("endYear", e.target.value)}
        />
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Description / Achievements"
        value={data.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </div>
  );
};

export default Education;