
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateSection } from '../../../../../store/resumeSlice.js';

import ToolbarButton from '../../../Toolbar/shared/ToolbarButton.jsx';

import styles from '../../../Toolbar/RichTextToolbar.module.css';
import SettingsModalInput from './SettingsModalInput.jsx';

const ColumnIndex = ({ section, sectionColumnIndex }) => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const columns = useSelector(state => state.resume.columns);
   const resumeLayout = useSelector(state => state.resume.layout);

   const [columnIndexInputValue, setColumnIndexInputValue] = useState('');

   useEffect(() => {
      const columnIndex = columns.allIds.indexOf(section.columnId);
      if (columnIndex >= 0) setColumnIndexInputValue(columnIndex);
      else {
         setColumnIndexInputValue('?');
         console.error(`Invalid Section Column Index.  Column with ID ${section.columnId} not found in columns state.`);
      }
   }, [section.columnId]);

   const updateColumnIndex = (action) => {
      let newColumnIndex;

      if (action === 'increment') newColumnIndex = columnIndexInputValue + 1;
      else if (action === 'decrement') newColumnIndex = columnIndexInputValue - 1;
      else if (action === 'input') newColumnIndex = parseInt(columnIndexInputValue);

      if (newColumnIndex < 0 || newColumnIndex >= columns.allIds.length) {
         window.alert(`Column index must be between 0 and ${columns.allIds.length - 1}.`);
         return;
      }

      const newColumnId = columns.allIds[newColumnIndex];
      dispatch(updateSection({
         sectionId: section.id,
         changes: {
               columnId: newColumnId
            }
      }));
      setColumnIndexInputValue(newColumnIndex);
      
   }

   return (
      <div className={styles.toolBarButtonInputWrapper} style={{ justifySelf: 'end' }}>
         <SettingsModalInput
            name="columnIndexInput"
            label={`${section.label} Column Index`}
            value={columnIndexInputValue}
            handleSetInputValue={setColumnIndexInputValue}
            handleSetValue={() => updateColumnIndex('input')}
         />
         <ToolbarButton
            text="-"
            command={() => updateColumnIndex('decrement')}
         />
         <ToolbarButton
            text="+"
            command={() => updateColumnIndex('increment')}
         />
      </div>
   )
}

export default ColumnIndex;