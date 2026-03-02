import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import AutoWidthInput from "../AutoWidthInput"; // adjust path as needed
import styles from "./Skills.module.css";
import "./Sections.css";

const Skills = ({ id, data }) => {
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

      {/* <div className="subsectionWrapperDiv"> */}
        {data.subsections?.map((sub) => (
          <div key={sub.id} className="subsectionWrapperDiv">
            {sub.fields?.map((field) => (
              <AutoWidthInput
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

export default Skills;