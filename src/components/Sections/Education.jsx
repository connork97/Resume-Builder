import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import "./Sections.css";

const Education = ({ id, data }) => {
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
      {/* Section Title */}
      <div className="sectionTitle">{data.sectionTitle}</div>

      {/* Render All Subsections */}
      {data.subsections?.map((sub) => (
        <div key={sub.id} className="educationSubsection">
          {sub.fields?.map((field) => {
            const isDescription = field.key === "description";
            const isStartOrEnd =
              field.key === "startDate" || field.key === "endDate";

            // DESCRIPTION → textarea
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

            // START/END DATE → normal input (you can wrap in a row if desired)
            if (isStartOrEnd) {
              return (
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
              );
            }

            // DEFAULT FIELD → normal input
            return (
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
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Education;