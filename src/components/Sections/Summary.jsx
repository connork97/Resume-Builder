import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Summary.module.css";
import "./Sections.css";

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
    <div className="sectionContainerDiv">
      <textarea
        className="sectionTextArea"
        placeholder="Write a brief professional summary..."
        value={data.summary}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Summary;