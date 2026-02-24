import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./Education.module.css";
import "./Sections.css";

const Education = ({ id, data }) => {
  const dispatch = useDispatch();

  // Update a specific education subsection (school entry)
  const handleSubsectionChange = (subId, field, value) => {
    const updated = data.subsections.map((sub) =>
      sub.id === subId ? { ...sub, [field]: value } : sub
    );

    dispatch(
      updateSection({
        id,
        changes: {
          data: {
            ...data,
            subsections: updated
          }
        }
      })
    );
  };

  return (
    <div className="sectionContainerDiv">
      {/* SECTION TITLE */}
      <div className="sectionTitle">{data.sectionTitle}</div>

      {/* RENDER ALL EDUCATION SUBSECTIONS */}
      {data.subsections.map((sub) => (
        <div key={sub.id}>
          <input
            className="sectionInput"
            type="text"
            placeholder="School Name"
            value={sub.school}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "school", e.target.value)
            }
          />

          <input
            className="sectionInput"
            type="text"
            placeholder="Degree"
            value={sub.degree}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "degree", e.target.value)
            }
          />

          <input
            className="sectionInput"
            type="text"
            placeholder="Field of Study"
            value={sub.field}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "field", e.target.value)
            }
          />
          <input
            className="sectionInput"
            type="text"
            placeholder="Location"
            value={sub.field}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "location", e.target.value)
            }
          />

          <div className="sectionDateRow">
            <input
              className="sectionInput"
              type="text"
              placeholder="Start Year"
              value={sub.startYear}
              onChange={(e) =>
                handleSubsectionChange(sub.id, "startYear", e.target.value)
              }
            />

            <input
              className="sectionInput"
              type="text"
              placeholder="End Year"
              value={sub.endYear}
              onChange={(e) =>
                handleSubsectionChange(sub.id, "endYear", e.target.value)
              }
            />
          </div>

          <textarea
            className="sectionTextArea"
            placeholder="Description / Achievements"
            value={sub.description}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "description", e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Education;