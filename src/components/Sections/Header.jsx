import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Header.module.css";

const Header = ({ id, data }) => {
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
    <div className={styles.headerSection}>
      <input
        className={styles.nameInput}
        type="text"
        placeholder="Your Name"
        value={data.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <input
        className={styles.titleInput}
        type="text"
        placeholder="Your Title"
        value={data.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
    </div>
  );
}

export default Header;