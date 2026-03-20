import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateSection } from "../../store/resumeSlice.js";

import styles from './SettingsModal.module.css';

import SettingsModalInput from './SettingsModalInput.jsx';
import SettingsModalDropdown from './SettingsModalDropdown.jsx';
import FontSize from '../Toolbar/FontSize.jsx';
import FontColor from '../Toolbar/FontColor.jsx';
import LineHeight from '../Toolbar/LineHeight.jsx';
import TextAlign from '../Toolbar/TextAlign.jsx';

const SettingsModal = ({ section, isSettingsModalOpen, setIsSettingsModalOpen }) => {

   const dispatch = useDispatch();

   const resumeStyling = useSelector(state => state.resume.styling);
   const sections = useSelector(state => state.resume.sections);
   const activeSectionId = useSelector(state => state.resume.activeSectionId);

   const getColumnCount = (gridTemplateColumns) => {
      const match = gridTemplateColumns.match(/repeat\((\d+),\s*1fr\)/);
      return match ? parseInt(match[1], 10) : "auto";
   };

   const getRowCount = (gridTemplateRows) => {
      const match = gridTemplateRows.match(/repeat\((\d+),\s*auto\)/);
      console.log("getRowCount match:", match);
      return match ? parseInt(match[1], 10) : "auto";
   }

   const [columnsInputValue, setColumnsInputValue] = useState("auto");
   const [rowsInputValue, setRowsInputValue] = useState("auto");

   useEffect(() => {
      if (section.layout.gridTemplateColumns) setColumnsInputValue(getColumnCount(section.layout.gridTemplateColumns));
      if (section.layout.gridTemplateRows) setRowsInputValue(getRowCount(section.layout.gridTemplateRows));
   }, []);

   console.log('columnsInputValue:', columnsInputValue);
   console.log('rowsInputValue:', rowsInputValue);

   const dispatchLayoutChanges = (layoutChanges) => {
      // Update the section's layout in the state
      // dispatch(updateSectionLayout({ sectionId: section.id, layout }));
      // section.subsections.map((sub) => {
         console.log("Dispatching layout changes for section", section.label, "with changes:", layoutChanges);
      dispatch(updateSection({
         sectionId: section.id,
         // subsectionId: sub.id,
         changes: {
            layout: {
               ...section.layout,
               ...layoutChanges
            }
         }
      }))
      // });

      console.log(`Setting new layout values: ${layoutChanges} for section ${section.label}`);
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
            // justifyItems: 'center'
         };
      } else if (columnsValue == 'auto') {
         layoutChanges = {
            display: 'flex',
            justifyContent: 'space-evenly'
            // display: 'grid',
            // gridTemplateColumns: section.subsections[0].fields.length > 0 ? `repeat(${section.subsections[0].fields.length}, 1fr)` : 'auto',
            // gridTemplateRows: 'auto'
         };
      }
      dispatchLayoutChanges(layoutChanges);
   }

   const settingModalInputArr = [
      {
         label: "Columns",
         value: columnsInputValue,
         handleSetInputValue: setColumnsInputValue,
         handleSetValue: handleSetLayoutChanges
      },
      {
         label: "Rows",
         value: rowsInputValue,
         handleSetInputValue: setRowsInputValue,
         handleSetValue: handleSetLayoutChanges
      }
   ];

   const renderSettingsModalRows = () => {
      // let modalRowPropsArr = [sections={sections}, resumeStyling={resumeStyling}, activeSectionId={activeSectionId}];
      let componentsArr = [
         { component: FontSize, label: "Font Size" },
         { component: FontColor, label: "Font Color" },
         { component: LineHeight, label: "Line Height" },
         { component: TextAlign, label: "Text Align" },
      ];

      return componentsArr.map((Component, index) => (
         <div className={styles.settingsModalRow} key={index}>
            <p className={styles.settingsModalLabel}>{Component.label}:</p>
            <Component.component
               sections={sections}
               resumeStyling={resumeStyling}
               activeSectionId={activeSectionId}
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
            {settingModalInputArr.map((input) => (
               <SettingsModalInput
                  key={input.label}
                  label={input.label}
                  value={input.value}
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