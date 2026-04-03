import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { updateSection } from "../../store/resumeSlice.js";

import { BASE_URL } from "../../config.js";

import Section from "../Section/Section.jsx";
import Column from "./Column.jsx";
import SelectResume from "../../pages/Home/SelectResume.jsx";

import styles from "./Page.module.css";

const Page = ({ resumeId }) => {

   const user = useSelector((state) => state.user);
   const userResumeIds = user.resumes || [];

   const [resumeToEdit, setResumeToEdit] = useState({});

   const resumeStyling = useSelector((state) => state.resume.styling);
   const columns = useSelector((state) => state.resume.columns);

   const dispatch = useDispatch();

   const handleFixInvalidColumnIndex = (sectionId) => {
      dispatch(updateSection({ sectionId, changes: { layout: { columnIndex: 0 } } }));
   }

   const fetchResumeById = async (resumeId) => {
      try {
         const response = await fetch(`${BASE_URL}/resumes/${resumeId}`)
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const resumeData = await response.json();
         console.log('Resume Data', resumeData);
         setResumeToEdit(resumeData);
      } catch (error) {
         console.error(`Error fetching resume of id ${resumeId}: `, error)
      }
   }

   useEffect(() => {
      console.log('resumeid', resumeId)
      if (resumeId) fetchResumeById(resumeId);
   }, [resumeId])

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
   // ? renderedColumns
   // ? <SelectResume />
   // : <SelectResume />

   return (
      <div className={styles.pageContainerDiv} style={{ ...resumeStyling }}>
         <p>{resumeToEdit.title}</p>
      </div>
   )
}

export default Page;