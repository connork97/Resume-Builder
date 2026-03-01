import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import styles from "./Contact.module.css";
import "./Sections.css";

const Contact = ({ id, data }) => {
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

      <div className={styles.contactInputWrapperDiv}>
        {data.subsections?.map((sub) => (
          <div key={sub.id} className={styles.contactRow}>
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

export default Contact;