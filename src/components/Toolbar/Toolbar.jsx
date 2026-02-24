import React from "react";

import styles from "./Toolbar.module.css";

import ToolbarButton from "./ToolbarButton";

import { useDispatch } from "react-redux";
import { addSection } from "../../store/resumeSlice";


const Toolbar = () => {

   const dispatch = useDispatch();

   const handleAddHeader = () => {
      dispatch(addSection("header"));
      console.log("dispatching header")
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
            command={() => dispatch(addSection("workHistory"))}
         />
         <ToolbarButton
            type="education"
            text="Add Education Section"
            command={() => dispatch(addSection("education"))}
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