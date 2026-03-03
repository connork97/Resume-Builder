import React from "react";
import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";

import Header from "../Sections/Header";
import Contact from "../Sections/Contact";
import WorkHistory from "../Sections/WorkHistory";
import Education from "../Sections/Education";
import Skills from "../Sections/Skills";
import Summary from "../Sections/Summary";

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

  switch (type) {
    case "header":
      return <Header id={id} data={data} handleFieldChange={handleFieldChange} />;
    case "contact":
      return <Contact id={id} data={data} handleFieldChange={handleFieldChange} />;
    case "workHistory":
      return <WorkHistory id={id} data={data} handleFieldChange={handleFieldChange} />;
    case "education":
      return <Education id={id} data={data} handleFieldChange={handleFieldChange} />;
    case "skills":
      return <Skills id={id} data={data} handleFieldChange={handleFieldChange} />;
    case "summary":
      return <Summary id={id} data={data} handleFieldChange={handleFieldChange} />;
    default:
      return <div>Unknown section type: {type}</div>;
  }
}

export default SectionWrapper;