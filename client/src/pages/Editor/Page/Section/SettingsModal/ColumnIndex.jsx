
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateColumn, updateSection } from '@/store/resumeSlice.js';

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

   const moveSectionLeftOrRight = (leftOrRight) => {
      let newColumnIndex;

      if (leftOrRight === 'right') newColumnIndex = columnIndexInputValue + 1;
      else if (leftOrRight === 'left') newColumnIndex = columnIndexInputValue - 1;
      // else if (leftOrRight === 'input') newColumnIndex = parseInt(columnIndexInputValue);

      if (newColumnIndex < 0 || newColumnIndex >= columns.allIds.length) {
         alert(`Cannot move ${section.label} section any further ${leftOrRight}.`);
         return;
      }

      const oldColumnId = section.columnId;
      const newColumnId = columns.allIds[newColumnIndex];

      if (oldColumnId === newColumnId) return;

      const oldColumn = columns.byId[oldColumnId];
      const newColumn = columns.byId[newColumnId];

      const oldSectionIds = oldColumn.sectionIds.filter(id => id !== section.id);

      const newColumnSectionIdsSorted = newColumn.sectionIds
         .map(id => sections.byId[id])
         .filter(Boolean)
         .sort((a, b) => a.position - b.position)
         .map(section => section.id);

      const insertIndex = newColumnSectionIdsSorted.findIndex(id => {
         return sections.byId[id].position > section.position;
      });

      const newSectionIds = [...newColumnSectionIdsSorted];

      if (insertIndex === -1) {
         newSectionIds.push(section.id);
      } else {
         newSectionIds.splice(insertIndex, 0, section.id);
      }

      dispatch(updateSection({
         sectionId: section.id,
         changes: {
            columnId: newColumnId,
         },
      }));

      dispatch(updateColumn({
         id: oldColumnId,
         changes: {
            sectionIds: oldSectionIds,
         },
      }));

      dispatch(updateColumn({
         id: newColumnId,
         changes: {
            sectionIds: newSectionIds,
         },
      }));

      setColumnIndexInputValue(newColumnIndex);
   };

   return (
      <div className={styles.toolBarButtonInputWrapper} style={{ justifySelf: 'end' }}>
         {/* <SettingsModalInput
            name="columnIndexInput"
            label={`${section.label} Column Index`}
            value={columnIndexInputValue}
            handleSetInputValue={setColumnIndexInputValue}
            handleSetValue={() => moveSectionLeftOrRight('input')}
         /> */}
         <span className={styles.sectionLabelSpan}>Move {section.label} Section</span>
         <div style={{ display: 'flex' }}>
            <ToolbarButton
               text="Left"
               command={() => moveSectionLeftOrRight('left')}
            />
            <ToolbarButton
               text="Right"
               command={() => moveSectionLeftOrRight('right')}
            />
         </div>
      </div>
   )
}

export default ColumnIndex;