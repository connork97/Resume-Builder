import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateColumn } from '@/store/resumeSlice.js';

import styles from './ColumnSettings.module.css';

const ColumnSettings = () => {

   const dispatch = useDispatch();

   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);
   const column = useSelector(state => state.resume.columns.byId[section.columnId]);

   const [columnWidthInputValue, setColumnWidthInputValue] = useState(column.width.replace("%", "") || 'auto');
   const [autoWidthInputValue, setAutoWidthInputValue] = useState(column.autoWidth || false);

   const handleColumnWidthSubmit = (e) => {
      e.preventDefault();
      if (columnWidthInputValue < 0) {
         alert()
      }
      const newColumnWidth = columnWidthInputValue + '%';
      dispatch(updateColumn({
         id: column.id,
         changes: {
            width: newColumnWidth,
            autoWidth: false,
         }
      }));
      setAutoWidthInputValue(false);
   }

   const handleAutoWidthSubmit = () => {
      // e.preventDefault();
      dispatch(updateColumn({
         id: column.id,
         changes: {
            autoWidth: autoWidthInputValue,
         }
      }));
   }

   useEffect(() => {
      handleAutoWidthSubmit();
   }, [autoWidthInputValue])

   return (
      <div className={styles.columnSettingsContainer}>
         <h2>Column {column.position + 1} Settings:</h2>
         <form
            className={styles.columnSettingsRow}
            onSubmit={handleColumnWidthSubmit}
         >
            <label htmlFor="columnWidthInput">Width:</label>
            <input
               id="columnWidthInput"
               className={styles.columnSettingsInput}
               type="number"
               min='1'
               max='100'
               step='0.1'
               value={columnWidthInputValue}
               onChange={(e) => setColumnWidthInputValue(e.target.value)}
            />
            <span className={styles.columnSettingsSpan}>%</span>
         </form>
         <form
            className={styles.columnSettingsRow}
            onSubmit={handleAutoWidthSubmit}
         >
            <label htmlFor="autoWidthInput">AutoWidth:</label>
            <input
               id="autoWidthInput"
               className={styles.columnSettingsInput}
               type="checkbox"
               checked={autoWidthInputValue}
               onChange={(e) => setAutoWidthInputValue(e.target.checked)}
               
            />
         </form>
      </div>
   )
}

export default ColumnSettings;