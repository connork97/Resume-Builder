import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { updateSection } from "../../store/resumeSlice.js";

import Section from "../Section/Section.jsx";
import Column from "./Column.jsx";
import SelectResume from "./SelectResume.jsx";

import styles from "./Page.module.css";

const Page = () => {
   const user = useSelector((state) => state.user);
   const userResumeIds = user.resumes || [];

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
      // ? renderedColumns
      ? <SelectResume />
      : <SelectResume />

   return (
      <div className={styles.pageContainerDiv} style={{ ...resumeStyling }}>
         {pageContent}
      </div>
   )
}

export default Page;