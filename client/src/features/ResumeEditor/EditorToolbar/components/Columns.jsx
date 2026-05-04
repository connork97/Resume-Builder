import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { BASE_URL } from '@/config.js';

import { addColumn, deleteColumn, setResume } from '@/store/resumeSlice.js';

import ToolbarButton from "./shared/ToolbarButton.jsx";
import ToolbarInput from "./shared/ToolbarInput.jsx";

import styles from './RichTextToolbar.module.css';
import normalizeResumeFromApi from '@/utils/normalizeResumeFromApi.js';
import { addColumnToApi, deleteLastColumnFromApi,  } from '@/services/resumeServices.js';

const Columns = ({ label }) => {

   const dispatch = useDispatch();

   const resume = useSelector(state => state.resume);

   const columns = useSelector(state => state.resume.columns);

   // const [columnInputValue, setColumnInputValue] = useState(0);
   const [columnInputValue, setColumnInputValue] = useState(columns.allIds.length || 0);
   
   useEffect(() => {
      setColumnInputValue(columns.allIds.length)
   }, [columns.allIds]);

   const addColumn = async () => {
      const updatedNormalizedResumeData = await addColumnToApi(resume.id);

      if (!updatedNormalizedResumeData) {
         return;
      }
      dispatch(setResume(updatedNormalizedResumeData));

   }

   const removeLastColumn = async () => {
      const autoSave = false;

      const lastColumnId = columns.allIds.at(-1);

      if (autoSave) {
         const updatedNormalizedResumeData = await deleteLastColumnFromApi(resume.id);
         if (!updatedNormalizedResumeData) {
            return;
         }
      }
      dispatch(deleteColumn(lastColumnId));
   }

   const columnInputLabel = columnInputValue == 1 ? 'Column': 'Columns'

   return (
      <div className={styles.toolBarButtonInputWrapper}>
         <span className={styles.toolbarLabelSpan}>
            {columnInputValue + ' ' + columnInputLabel}:
         </span>
         <ToolbarButton
            text="-"
            command={() => removeLastColumn()}
         />
         {/* <ToolbarInput
            value={columnInputValue}
            handleChange={setColumnInputValue}
            commitChange={() => updateColumns()}
            onBlur={() => updateColumns()}
         /> */}
         <ToolbarButton
            text="+"
            command={() => addColumn()}
         />
      </div>
   )
}

export default Columns;