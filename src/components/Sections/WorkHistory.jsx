import AutoWidthInput from "../AutoWidthInput"; // adjust path as needed
import styles from "./WorkHistory.module.css";
import "./Sections.css";

const WorkHistory = ({ id, data, handleFieldChange }) => {

  return (
    <div className="sectionContainerDiv">
      <div className="sectionTitle">{data.sectionTitle}</div>

      {data.subsections?.map((sub) => (
        <div key={sub.id} className="subsectionWrapperDiv">
          {sub.fields?.map((field) => {
            const isDescription = field.key === "description";

            if (isDescription) {
              return (
                <textarea
                  key={field.id}
                  className="sectionTextArea"
                  placeholder={field.label}
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(sub.id, field.id, e.target.value)
                  }
                />
              );
            }

            return (
              <AutoWidthInput
                key={field.id}
                className="sectionInput"
                value={field.value}
                placeholder={field.label}
                onChange={(value) =>
                  handleFieldChange(sub.id, field.id, value)
                }
              />
            );
          })}
        </div>
      ))}
      {/* <div style={{width: "5rem", height: "2rem", border: "1px solid black"}} contentEditable /> */}
    </div>
  );
};

export default WorkHistory;