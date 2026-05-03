import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { setResumeId, updateSection, setResume } from "@/store/resumeSlice.js";

import { BASE_URL } from "@/config.js";

import normalizeResumeFromApi from "@/utils/normalizeResumeFromApi.js";

// import Section from "./Section/Section.jsx";
import Column from "./components/Column.jsx";
// import SelectResume from "../../../pages/HomePage/components/SelectResume.jsx";

import styles from "./ResumePaper.module.css";

const ResumePaper = () => {

   const user = useSelector((state) => state.user);
   const userResumeIds = user.resumes || [];

   const resume = useSelector(state => state.resume);
   const resumeId = resume.id;

   const [resumeToEdit, setResumeToEdit] = useState({});

   const resumeStyling = useSelector((state) => state.resume.styling);
   const columns = useSelector((state) => state.resume.columns);

   const dispatch = useDispatch();

   const handleFixInvalidColumnIndex = (sectionId) => {
      dispatch(updateSection({ sectionId, changes: { layout: { columnIndex: 0 } } }));
   }

   // Handle how many columns to render on the page based on resume layout settings.
   const renderedColumns = columns.allIds?.map((columnId) => {
      const column = columns.byId[columnId];
      if (!column) {
         console.error(`Column with ID ${columnId} not found.`);
         return null;
      }

      return <Column key={column.id} column={column} />
   });

   const pageContent = userResumeIds.length > 0

   return (
      <div className={styles.pageContainerDiv} style={{ ...resumeStyling }}>
         {renderedColumns}
      </div>
   )
}

export default ResumePaper;