import React from "react";
import AutoWidthInput from "../AutoWidthInput"; // adjust path as needed
import "./Sections.css";

const Education = ({ id, data, handleFieldChange }) => {

  return (
    <div className="sectionContainerDiv">
      {/* Section Title */}
      <div className="sectionTitle">{data.sectionTitle}</div>

      {/* Render All Subsections */}
      {data.subsections?.map((sub) => (
        <div key={sub.id} className="subsectionWrapperDiv">
          {sub.fields?.map((field) => {
            const isDescription = field.key === "description";

            // DESCRIPTION → textarea (not auto-width)
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

            // DEFAULT FIELD → AutoWidthInput
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
    </div>
  );
};

export default Education;