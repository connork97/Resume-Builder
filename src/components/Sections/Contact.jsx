import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import AutoWidthInput from "../AutoWidthInput"; // adjust path
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
        newValue: value,
      })
    );
  };

  return (
    <div className="sectionContainerDiv">
      <div className="sectionTitle">{data.sectionTitle}</div>

      {/* <div className={styles.contactInputWrapperDiv}> */}
        {data.subsections?.map((sub) => (
          <div key={sub.id} className="subsectionWrapperDiv" style={{justifyContent: 'space-evenly'}}>
            {sub.fields?.map((field) => (
              <AutoWidthInput
                id={field.id}
                key={field.id}
                className="sectionInput"
                value={field.value}
                placeholder={field.label}
                onChange={(value) =>
                  handleFieldChange(sub.id, field.id, value)
                }
              />
            ))}
          </div>
        ))}
      </div>
    // </div>
  );
};

export default Contact;