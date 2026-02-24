import React from "react";

import styles from "./Toolbar.module.css";

import ToolbarButton from "./ToolbarButton";

import { useDispatch, useSelector } from "react-redux";
import { addSection, addSubsection } from "../../store/resumeSlice";


const Toolbar = () => {

   const dispatch = useDispatch();

   const handleAddHeader = () => {
      dispatch(addSection("header"));
      console.log("dispatching header")
   }

   
   const sections = useSelector((state) => state.resume.sections);

   const handleAddWorkHistory = (sectionToAdd) => {

      const existing = sections.find(s => s.type === sectionToAdd);

      if (!existing) {
         dispatch(addSection(sectionToAdd));
      } else {
         dispatch(addSubsection({
            sectionId: existing.id,
            subsectionData: {
            jobTitle: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: ""
            }
         }));
      }
   }

   return (
      <div className={styles.toolbarContainerDiv}>
         <ToolbarButton
            type="header"
            text="Add Header"
            command={() => dispatch(addSection("header"))}
         />
         <ToolbarButton
            type="contact"
            text="Add Contact Section"
            command={() => dispatch(addSection("contact"))}
         />
         <ToolbarButton
            type="workHistory"
            text="Add Work History Section"
            // command={() => dispatch(addSection("workHistory"))}
            command={() => handleAddWorkHistory("workHistory")}
         />
         <ToolbarButton
            type="education"
            text="Add Education Section"
            // command={() => dispatch(addSection("education"))}
            command={() => handleAddWorkHistory("education")}
         />
         <ToolbarButton
            type="skills"
            text="Add Skills Section"
            command={() => dispatch(addSection("skills"))}
         />
         <ToolbarButton
            type="summary"
            text="Add Summary Section"
            command={() => dispatch(addSection("summary"))}
         />
      </div>
   );
}

export default Toolbar;