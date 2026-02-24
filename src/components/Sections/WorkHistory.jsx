import { useDispatch } from "react-redux";
import { updateSection } from "../../store/resumeSlice";
import styles from "./WorkHistory.module.css";
import "./Sections.css";

const WorkHistory = ({ id, data }) => {
  const dispatch = useDispatch();

  // Update a specific subsection (job entry)
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

      {/* RENDER ALL JOB SUBSECTIONS */}
      {data.subsections.map((sub) => (
        <div key={sub.id}>
          <input
            className="sectionInput"
            type="text"
            placeholder="Job Title"
            value={sub.jobTitle}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "jobTitle", e.target.value)
            }
          />

          <input
            className="sectionInput"
            type="text"
            placeholder="Company"
            value={sub.company}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "company", e.target.value)
            }
          />

          <input
            className="sectionInput"
            type="text"
            placeholder="Location"
            value={sub.location}
            onChange={(e) =>
              handleSubsectionChange(sub.id, "location", e.target.value)
            }
          />

          <div className="sectionDateRow">
            <input
              className="sectionInput"
              type="text"
              placeholder="Start Date"
              value={sub.startDate}
              onChange={(e) =>
                handleSubsectionChange(sub.id, "startDate", e.target.value)
              }
            />

            <input
              className="sectionInput"
              type="text"
              placeholder="End Date"
              value={sub.endDate}
              onChange={(e) =>
                handleSubsectionChange(sub.id, "endDate", e.target.value)
              }
            />
          </div>

          <textarea
            className="sectionTextArea"
            placeholder="Description / Responsibilities"
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

export default WorkHistory;