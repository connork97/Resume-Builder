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
      <input
        className="sectionInput"
        type="text"
        placeholder="Email"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <input
        className="sectionInput"
        type="text"
        placeholder="Phone"
        value={data.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
      />

      <input
        className="sectionInput"
        type="text"
        placeholder="Location"
        value={data.location}
        onChange={(e) => handleChange("location", e.target.value)}
      />

      <input
        className="sectionInput"
        type="text"
        placeholder="Website"
        value={data.website}
        onChange={(e) => handleChange("website", e.target.value)}
      />

      <input
        className="sectionInput"
        type="text"
        placeholder="LinkedIn"
        value={data.linkedin}
        onChange={(e) => handleChange("linkedin", e.target.value)}
      />
    </div>
  );
};

export default Contact;