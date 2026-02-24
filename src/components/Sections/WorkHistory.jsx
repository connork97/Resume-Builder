import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./WorkHistory.module.css";

const WorkHistory = ({ id, data }) => {
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
    <div className={styles.workHistorySection}>
      <input
        className={styles.input}
        type="text"
        placeholder="Job Title"
        value={data.jobTitle}
        onChange={(e) => handleChange("jobTitle", e.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Company"
        value={data.company}
        onChange={(e) => handleChange("company", e.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Location"
        value={data.location}
        onChange={(e) => handleChange("location", e.target.value)}
      />

      <div className={styles.dateRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Start Date"
          value={data.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="End Date"
          value={data.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Description / Responsibilities"
        value={data.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </div>
  );
};

export default WorkHistory;