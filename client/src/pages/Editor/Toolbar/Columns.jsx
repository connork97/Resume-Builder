import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { BASE_URL } from '../../../config.js';

import { addColumn, deleteColumn, setResume } from '../../../store/resumeSlice.js';

import ToolbarButton from "./shared/ToolbarButton.jsx";
import ToolbarInput from "./shared/ToolbarInput.jsx";

import styles from './RichTextToolbar.module.css';
import normalizeResumeFromApi from '../../../utils/normalizeResumeFromApi.js';

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
      // console.log(columns)
      try {
         const response = await fetch(`${BASE_URL}/resumes/${resume.id}/add/column`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            // credentials: 'include',
         });
         const data = await response.json();
         if (!response.ok) {
            throw data?.error;
         }
         console.log('ADD COLUMN DATA: ', data);
         const normalizedResume = normalizeResumeFromApi(data);
         dispatch(setResume(normalizedResume));
      } catch(error) {
         console.error(error || 'Error adding column.');
         alert(error.code + '\n' + error.message);
      }
   }

   const deleteColumn = async () => {
      // console.log(columns)
      try {
         const response = await fetch(`${BASE_URL}/resumes/${resume.id}/delete/column`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            // credentials: 'include',
         });
         const data = await response.json();
         if (!response.ok) {
            throw data?.error;
         }
         console.log('ADD COLUMN DATA: ', data);
         const normalizedResume = normalizeResumeFromApi(data);
         dispatch(setResume(normalizedResume));
      } catch(error) {
         console.error(error || 'Error adding column.');
         alert(error.code + '\n' + error.message);
      }
   }

   const updateColumns = () => {
      if (columnInputValue < 1) {
         alert('You must have at least one column.');
         return;
      }
      else if (columnInputValue == columns.allIds.length) {
         return;
      }

   }

   const columnInputLabel = columnInputValue == 1 ? 'Column': 'Columns'

   return (
      <div className={styles.toolBarButtonInputWrapper}>
         <span className={styles.toolbarLabelSpan}>
            {columnInputValue + ' ' + columnInputLabel}:
         </span>
         <ToolbarButton
            text="-"
            command={() => deleteColumn()}
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