import React from "react";
import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";

import './Sections.css';

import AutoWidthInput from "../AutoWidthInput.jsx";

// import Header from "../Sections/Header";
// import Contact from "../Sections/Contact";
// import WorkHistory from "../Sections/WorkHistory";
// import Education from "../Sections/Education";
// import Skills from "../Sections/Skills";
// import Summary from "../Sections/Summary";

const SectionWrapper = ({ id, type, data }) => {

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
      <div className="sectionTitle" style={{...data.styling}}>{data.sectionTitle}</div>

      {/* Render All Subsections */}
      {data.subsections?.map((sub) => (
        <div key={sub.id} className="subsectionWrapperDiv" style={{...sub.styling}}>
          {sub.fields?.map((field) => {
            const isDescription = field.key === "description";
            console.log(sub.styling)
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
                styling={field.styling}
                onChange={(value) =>
                  handleFieldChange(sub.id, field.id, value)
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  )
  // switch (type) {
  //   case "header":
  //     return <Header id={id} data={data} handleFieldChange={handleFieldChange} />;
  //   case "contact":
  //     return <Contact id={id} data={data} handleFieldChange={handleFieldChange} />;
  //   case "workHistory":
  //     return <WorkHistory id={id} data={data} handleFieldChange={handleFieldChange} />;
  //   case "education":
  //     return <Education id={id} data={data} handleFieldChange={handleFieldChange} />;
  //   case "skills":
  //     return <Skills id={id} data={data} handleFieldChange={handleFieldChange} />;
  //   case "summary":
  //     return <Summary id={id} data={data} handleFieldChange={handleFieldChange} />;
  //   default:
  //     return <div>Unknown section type: {type}</div>;
  // }
}

export default SectionWrapper;