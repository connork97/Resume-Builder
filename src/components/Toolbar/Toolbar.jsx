import React from "react";
import styles from "./Toolbar.module.css";

import ToolbarButton from "./ToolbarButton";

import { useDispatch, useSelector } from "react-redux";
import { addSection, addSubsection } from "../../store/resumeSlice";

const Toolbar = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.resume.sections);

   //   Add a section OR add a new subsection if it exists
  const handleAddOrAppend = (type) => {
    const existing = sections.find((s) => s.type === type);

    if (!existing) {
      // Create a brand new section
      dispatch(addSection(type));
    } else {
      // Add a new subsection (slice will auto-fill default fields)
      dispatch(
        addSubsection({
          sectionId: existing.id,
          subsectionData: {} // slice fills in default fields for this type
        })
      );
    }
  };

  return (
    <div className={styles.toolbarContainerDiv}>
      <ToolbarButton
        type="header"
        text="Add Header"
      //   command={() => dispatch(addSection("header"))}
        command={() => handleAddOrAppend("header")}
      />

      <ToolbarButton
        type="contact"
        text="Add Contact Section"
      //   command={() => dispatch(addSection("contact"))}
        command={() => handleAddOrAppend("contact")}
      />

      <ToolbarButton
        type="workHistory"
        text="Add Work History Section"
        command={() => handleAddOrAppend("workHistory")}
      />

      <ToolbarButton
        type="education"
        text="Add Education Section"
        command={() => handleAddOrAppend("education")}
      />

      <ToolbarButton
        type="skills"
        text="Add Skills Section"
        command={() => handleAddOrAppend("skills")}
      />

      <ToolbarButton
        type="summary"
        text="Add Summary Section"
      //   command={() => dispatch(addSection("summary"))}
        command={() => handleAddOrAppend("summary")}
      />
    </div>
  );
};

export default Toolbar;