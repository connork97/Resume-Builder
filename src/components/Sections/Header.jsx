import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import styles from "./Header.module.css";
import "./Sections.css";

const Header = ({ id, data }) => {
  const dispatch = useDispatch();

  const handleFieldChange = (fieldId, value) => {
    dispatch(
      updateField({
        sectionId: id,
        subsectionId: null, // header has no subsections currently
        fieldId,
        newValue: value
      })
    );
  };

  return (
    <div className="sectionContainerDiv">
      {data.fields?.map((field) => (
        <input
          key={field.id}
          className={
            field.key === "name"
              ? styles.nameInput
              : styles.titleInput
          }
          type="text"
          placeholder={field.label}
          value={field.value}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
        />
      ))}
    </div>
  );
};

export default Header;