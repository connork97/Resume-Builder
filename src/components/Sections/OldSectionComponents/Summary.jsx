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
            content: value
          }
        }
      })
    );
  };

  return (
    <div className="sectionContainerDiv">
      <div className="sectionTitle">{data.sectionTitle}</div>
      <textarea
        className="sectionTextArea"
        placeholder="Write a brief professional summary..."
        value={data.content}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Summary;