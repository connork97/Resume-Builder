import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { addColumn, deleteColumn, updateResume, updateSection } from '../../store/resumeSlice.js';

import ToolbarButton from "./ToolbarButton.jsx";
import ToolbarInput from "./ToolbarInput.jsx";

import styles from '../Toolbar/RichTextToolbar.module.css';

const Columns = () => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const resumeLayout = useSelector(state => state.resume.layout);
   // const columns = resumeLayout.columns;
   const columns = useSelector(state => state.resume.columns);

   const [columnInputValue, setColumnInputValue] = useState(columns.allIds.length);

   const handleUpdateColumns = (newColumnCount) => {

      if (newColumnCount === 'decrement') newColumnCount = columns.allIds.length - 1;
      if (newColumnCount === 'increment') newColumnCount = columns.allIds.length + 1;
      if (newColumnCount === 'input') newColumnCount = parseInt(columnInputValue);

      if (newColumnCount == columns.allIds.length) return;
      if (newColumnCount < 1) {
         window.alert("You must have at least one column.");
         return;
      }
      if (newColumnCount > columns.allIds.length) {
         for (let i = columns.allIds.length; i < newColumnCount; i++) {
            dispatch(addColumn());
         }
      }
      if (newColumnCount < columns.allIds.length) {
         for (let i = columns.allIds.length; i >= newColumnCount; i--) {
            const columnIdToRemove = columns.allIds[i];
            dispatch(deleteColumn({ columnId: columnIdToRemove }));
         }
      }
      setColumnInputValue(newColumnCount);
   }

   return (
      <div className={styles.toolBarButtonInputWrapper}>
         <ToolbarButton
            text="-"
            command={() => handleUpdateColumns('decrement')}
         />
         <ToolbarInput
            value={columnInputValue}
            handleChange={setColumnInputValue}
            commitChange={() => handleUpdateColumns('input')}
            onBlur={() => handleUpdateColumns(columnInputValue)}
         />
         <ToolbarButton
            text="+"
            command={() => handleUpdateColumns('increment')}
         />
      </div>
   )
}

export default Columns;