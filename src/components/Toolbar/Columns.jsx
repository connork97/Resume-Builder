import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '../../store/resumeSlice.js';

import ToolbarButton from "./ToolbarButton.jsx";
import ToolbarInput from "./ToolbarInput.jsx";

import styles from '../Toolbar/RichTextToolbar.module.css';

const Columns = () => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const resumeLayout = useSelector(state => state.resume.layout);

   const [columnCountInputValue, setColumnCountInputValue] = useState(resumeLayout.columns.count);

   const handleUpdateResumeColumns = (newColumnCount) => {
      if (newColumnCount < 1) {
         window.alert("You must have at least one column.");
         return;
      }
      const newColumnWidthsArr = Array(newColumnCount).fill(`${100 / newColumnCount}%`);
      dispatch(updateResume({
         key: 'layout',
         changes: {
            columns: {
               count: newColumnCount,
               width: newColumnWidthsArr
            }
         }
      }));
      setColumnCountInputValue(newColumnCount);
   }

   return (
      <div className={styles.toolBarButtonInputWrapper}>
         <ToolbarButton
            text="-"
            command={() => handleUpdateResumeColumns(resumeLayout.columns.count - 1)}
         />
         <ToolbarInput
            value={columnCountInputValue}
            onChange={(e) => setColumnCountInputValue(parseInt(e.target.value) || 1)}
            onBlur={() => handleUpdateResumeColumns(columnCountInputValue)}
         />
         <ToolbarButton
            text="+"
            command={() => handleUpdateResumeColumns(resumeLayout.columns.count + 1)}
         />
      </div>
   )
}

export default Columns;