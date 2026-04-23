import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateColumn } from '../../../../../store/resumeSlice.js';
import ToolbarButton from '../../../../../components/Toolbar/shared/ToolbarButton.jsx';

import styles from '../../../../../components/Toolbar/RichTextToolbar.module.css';
import SettingsModalInput from './SettingsModalInput.jsx';

const RowIndex = ({ section, }) => {

   const dispatch = useDispatch();

   const columns = useSelector(state => state.resume.columns);
   const column = columns.byId[section.columnId];

   const [rowIndexInputValue, setRowIndexInputValue] = useState('');

   useEffect(() => {
      const rowIndex = columns.byId[section.columnId].sectionIds.indexOf(section.id);
      if (rowIndex >= 0) setRowIndexInputValue(rowIndex);
      else {
         setRowIndexInputValue('?');
         console.error(`Invalid Section Row Index.  Column with ID ${section.columnId} not found in columns state.`);
      }
   }, [section.columnId, column.sectionIds]);

   const updateRowIndex = (action) => {
      let newRowIndex;

      if (action === 'increment') newRowIndex = rowIndexInputValue + 1;
      else if (action === 'decrement') newRowIndex = rowIndexInputValue - 1;
      else if (action === 'input') newRowIndex = parseInt(rowIndexInputValue);

      if (newRowIndex < 0 || newRowIndex >= column.sectionIds.length) {
         window.alert(`Row index must be between 0 and ${column.sectionIds.length - 1}.`);
         return;
      }

      const splicedSectionIds = [...column.sectionIds];
      splicedSectionIds.splice(rowIndexInputValue, 1);
      splicedSectionIds.splice(newRowIndex, 0, section.id);

      dispatch(updateColumn({
         id: section.columnId,
         changes: {
            sectionIds: splicedSectionIds
         }
      }));
      setRowIndexInputValue(newRowIndex);
   }


   return (
      <div className={styles.toolBarButtonInputWrapper} style={{ justifyContent: 'space-between' }}>
         <SettingsModalInput
            name="RowIndexInput"
            label={`${section.label} Row Index`}
            value={rowIndexInputValue}
            handleSetInputValue={setRowIndexInputValue}
            handleSetValue={() => updateRowIndex('input')}
         />
         <div style={{ display: 'flex' }}>
            <ToolbarButton
               style={{ justifySelf: 'end' }}
               text="-"
               command={() => updateRowIndex('decrement')}
            />
            <ToolbarButton
               style={{ justifySelf: 'end' }}
               text="+"
               command={() => updateRowIndex('increment')}
            />
         </div>
      </div>
   )
}

export default RowIndex;