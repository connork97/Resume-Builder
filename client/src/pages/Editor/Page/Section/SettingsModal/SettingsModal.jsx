import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateSection, updateColumn } from "../../../../../store/resumeSlice.js";

import styles from './SettingsModal.module.css';

import ColumnIndex from './ColumnIndex.jsx';
import RowIndex from './RowIndex.jsx';
import SettingsModalInput from './SettingsModalInput.jsx';
import FontSize from '../../../Formatting/FontSize.jsx';
import FontColor from '../../../Formatting/FontColor.jsx';
import LineHeight from '../../../Formatting/LineHeight.jsx';
import TextAlign from '../../../Formatting/TextAlign.jsx';
import BackgroundColor from '../../../Formatting/BackgroundColor.jsx';

const SettingsModal = ({ section, column, isSettingsModalOpen, setIsSettingsModalOpen }) => {

   const dispatch = useDispatch();

   const resumeStyling = useSelector(state => state.resume.styling);
   const sections = useSelector(state => state.resume.sections);
   const columns = useSelector(state => state.resume.columns);
   const activeSectionId = useSelector(state => state.resume.activeSectionId);

   const sectionColumnIndex = columns.allIds.indexOf(section.columnId);

   const getColumnCount = (gridTemplateColumns) => {
      const match = gridTemplateColumns.match(/repeat\((\d+),\s*1fr\)/);
      return match ? parseInt(match[1], 10) : "auto";
   };

   const getRowCount = (gridTemplateRows) => {
      const match = gridTemplateRows.match(/repeat\((\d+),\s*auto\)/);
      return match ? parseInt(match[1], 10) : "auto";
   }

   const [columnWidthInputValue, setColumnWidthInputValue] = useState('auto');

   const [columnIndexInputValue, setColumnIndexInputValue] = useState(0);
   const [columnsInputValue, setColumnsInputValue] = useState('');
   const [rowsInputValue, setRowsInputValue] = useState("auto");

   useEffect(() => {
      if (sectionColumnIndex) {
         setColumnIndexInputValue(sectionColumnIndex)};
      if (column?.width) setColumnWidthInputValue(parseInt(column.width));
         // setColumnWidthInputValue(parseInt(column?.width));
   }, [column.width, section.columnId]);

   const dispatchLayoutChanges = (layoutChanges) => {
      dispatch(updateSection({
         sectionId: section.id,
         changes: {
            layout: {
               ...section.layout,
               ...layoutChanges
            }
         }
      }))
   }

   const handleSetColumnWidth = () => {
      const newColumnWidth = columnWidthInputValue + '%';
      dispatch(updateColumn({ id: column.id, changes: { width: newColumnWidth } }));
   }

   const handleSetLayoutChanges = () => {
      let columnsValue = columnsInputValue;
      let rowsValue = rowsInputValue;
      if (columnsInputValue == 0) columnsValue = 'auto';
      if (rowsInputValue == 0) rowsValue = 'auto';

      let layoutChanges = {};
      
      if (columnsValue == 1) {
         layoutChanges = {
            display: 'flex',
            flexDirection: 'column',
         };
         setRowsInputValue('auto');
      }
      else if (columnsValue == 1 && (rowsValue == 1 || rowsValue == 'auto')) {
         layoutChanges = {
            display: 'flex',
            flexDirection: 'row'
         };
      } else if (columnsValue == 1 && rowsValue > 1) {
         layoutChanges = {
            display: 'flex',
            flexDirection: 'column'
         };
      }
      else if (columnsValue > 1) {
         layoutChanges = {
            display: 'grid',
            gridTemplateColumns: `repeat(${columnsValue}, 1fr)`,
            gridTemplateRows: rowsValue > 1 ? `repeat(${rowsValue}, auto)` : 'auto',
            alignItems: 'center'
         };
      } else if (columnsValue == 'auto') {
         layoutChanges = {
            display: 'flex',
            justifyContent: 'space-evenly'
         };
      }
      dispatchLayoutChanges(layoutChanges);
   }

   const settingModalInputArr = [
      {
         label: "Column Width",
         value: columnWidthInputValue,
         text: "%",
         handleSetInputValue: setColumnWidthInputValue,
         handleSetValue: handleSetColumnWidth
      },
   ];

   const renderSettingsModalRows = () => {
      let componentsArr = [
         { component: FontSize, label: "Font Size" },
         { component: FontColor, label: "Font Color" },
         { component: LineHeight, label: "Line Height" },
         { component: TextAlign, label: "Text Align", styling: { justifyContent: 'end' } },
         { component: BackgroundColor, label: 'Background Color'},
      ];

      return componentsArr.map((Component, index) => (
         <div className={styles.settingsModalRow} key={index}>
            <p className={styles.settingsModalLabel}>{Component.label}:</p>
            <Component.component
               sections={sections}
               resumeStyling={resumeStyling}
               activeSectionId={activeSectionId}
               {...Component.props}
            />
         </div>
      ));
   }

   return (
      <>
         <div
            className={styles.settingsModalOverlayDiv}
            styles={isSettingsModalOpen ? { display: 'block' } : { display: 'none' }}
            onClick={() => setIsSettingsModalOpen(false)}
         />
         <div className={styles.settingsModalContainerDiv}>
            <p className={styles.settingsModalSectionTitle}>Editing: {section.label}</p>
            <ColumnIndex
               section={section}
               sectionColumnIndex={sectionColumnIndex}
            />
            <RowIndex
               section={section}
            />
            {settingModalInputArr.map((input) => (
               <SettingsModalInput
                  key={input.label}
                  label={input.label}
                  value={input.value}
                  text={input.text}
                  styling={input.styling}
                  handleSetInputValue={input.handleSetInputValue}
                  handleSetValue={input.handleSetValue}
                  setIsSettingsModalOpen={setIsSettingsModalOpen}
               />
            ))}
            {renderSettingsModalRows()}
         </div>
      </>
   );
}

export default SettingsModal;