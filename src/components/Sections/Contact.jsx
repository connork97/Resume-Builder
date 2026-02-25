import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Contact.module.css";
import "./Sections.css";

const Contact = ({ id, data }) => {
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
    <div className="sectionContainerDiv">
      <div className="sectionTitle">{data.sectionTitle}</div>
      <div className={styles.contactInputWrapperDiv}>
        <input
          className={`${styles.contactSectionInput} sectionInput`}
          type="text"
          placeholder="Email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          />

        <input
          className={`${styles.contactSectionInput} sectionInput`}
          type="text"
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          />

        <input
          className={`${styles.contactSectionInput} sectionInput`}
          type="text"
          placeholder="Location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <input
          className={`${styles.contactSectionInput} sectionInput`}
          type="text"
          placeholder="Website"
          value={data.website}
          onChange={(e) => handleChange("website", e.target.value)}
          />

        <input
          className={`${styles.contactSectionInput} sectionInput`}
          type="text"
          placeholder="LinkedIn"
          value={data.linkedIn}
          onChange={(e) => handleChange("linkedIn", e.target.value)}
          />
        </div>
    </div>
  );
};

export default Contact;