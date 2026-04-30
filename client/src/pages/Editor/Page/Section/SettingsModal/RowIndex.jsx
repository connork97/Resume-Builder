import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateColumn } from '../../../../../store/resumeSlice.js';
import ToolbarButton from '../../../Toolbar/shared/ToolbarButton.jsx';

import styles from '../../../Toolbar/RichTextToolbar.module.css';
import SettingsModalInput from './SettingsModalInput.jsx';
import { updateSection } from '@/store/oldResumeSlice.js';

const RowIndex = ({ section }) => {

   const dispatch = useDispatch();

   const resume = useSelector(state => state.resume);
   const sections = resume.sections;
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

   const moveSectionUpOrDown = (upOrDown) => {
      const currentSection = sections.byId[section.id];

      const sectionsInColumn = column.sectionIds
         .map(id => sections.byId[id])
         .filter(Boolean)
         .sort((a, b) => a.position - b.position);

      const currentIndex = sectionsInColumn.findIndex(s => s.id === currentSection.id);

      if (currentIndex === -1) {
         alert("Could not find this section in the column.");
         return;
      }

      let sectionToSwapWith;
      
      if (upOrDown === 'down') sectionToSwapWith = sectionsInColumn[currentIndex + 1];
      else if (upOrDown === 'up') sectionToSwapWith = sectionsInColumn[currentIndex - 1];

      if (!sectionToSwapWith) {
         alert(`You cannot move this section ${upOrDown} any further.`);
         return;
      }
      dispatch(updateSection({
         sectionId: currentSection.id,
         changes: {
            position: sectionToSwapWith.position,
         },
      }));

      dispatch(updateSection({
         sectionId: sectionToSwapWith.id,
         changes: {
            position: currentSection.position,
         },
      }));

      setRowIndexInputValue(currentIndex + 1);
      if (upOrDown === 'down') updateRowIndex('increment');
      else if (upOrDown === 'up') updateRowIndex('decrement');
   };


   return (
      <div className={styles.toolBarButtonInputWrapper} style={{ justifyContent: 'space-between' }}>
         {/* <SettingsModalInput
            name="RowIndexInput"
            label={`${section.label} Row Index`}
            value={rowIndexInputValue}
            handleSetInputValue={setRowIndexInputValue}
            handleSetValue={() => updateRowIndex('input')}
         /> */}
         <span className={styles.sectionLabelSpan}>
            Move {section.label} Section
         </span>
         <div style={{ display: 'flex' }}>
            <ToolbarButton
               style={{ justifySelf: 'end' }}
               text="Up"
               command={() => moveSectionUpOrDown('up')}
            />
            <ToolbarButton
               style={{ justifySelf: 'end' }}
               text="Down"
               command={() => moveSectionUpOrDown('down')}
            />
         </div>
      </div>
   )
}

export default RowIndex;