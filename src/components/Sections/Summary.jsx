import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Summary.module.css";

const Summary = ({ id, data }) => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(
      updateSection({
        id,
        changes: {
          data: {
            ...data,
            summary: value
          }
        }
      })
    );
  };

  return (
    <div className={styles.summarySection}>
      <textarea
        className={styles.textarea}
        placeholder="Write a brief professional summary..."
        value={data.summary}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Summary;