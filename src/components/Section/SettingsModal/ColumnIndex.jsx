
import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '../../../store/resumeSlice.js';

import ToolbarButton from "../../Toolbar/ToolbarButton.jsx";
import ToolbarInput from "../../Toolbar/ToolbarInput.jsx";

import styles from '../../Toolbar/RichTextToolbar.module.css';
import SettingsModal from './SettingsModal.jsx';
import SettingsModalInput from './SettingsModalInput.jsx';

const ColumnIndex = ({ section, sectionColumnIndex, setHaveColumnsChanged }) => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const resumeLayout = useSelector(state => state.resume.layout);

   const [columnIndexInputValue, setColumnIndexInputValue] = useState(sectionColumnIndex);

   // console.log(section.)
   const updateColumnIndex = (newColumnIndex) => {
      console.log('Updating column index to:', newColumnIndex);
      setHaveColumnsChanged(prev => !prev);

      if (newColumnIndex < 0 || newColumnIndex >= resumeLayout.columns.length) {
         window.alert(`Column index must be between 0 and ${resumeLayout.columns.length - 1}.`);
         return;
      } dispatch(updateSection({
         sectionId: section.id,
         changes: {
            layout: {
               ...section.layout,
               columnIndex: newColumnIndex
            }
          }
       }));
       setColumnIndexInputValue(newColumnIndex);
    }
   // const updateColumnIndex = (newColumnCount) => {
   //    if (newColumnCount < 1) {
   //       window.alert("You must have at least one column.");
   //       return;
   //    }
   //    const newColumnWidthsArr = Array(newColumnCount).fill(`${100 / newColumnCount}%`);
   //    dispatch(updateResume({
   //       key: 'layout',
   //       changes: {
   //          columns: {
   //             count: newColumnCount,
   //             width: newColumnWidthsArr
   //          }
   //       }
   //    }));
   //    setColumnIndexInputValue(newColumnCount);
   // }

   return (
      <div className={styles.toolBarButtonInputWrapper}>
         <SettingsModalInput
            label={`${section.label} Column Index`}
            value={columnIndexInputValue}
            handleSetInputValue={setColumnIndexInputValue}
            handleSetValue={() => updateColumnIndex(parseInt(columnIndexInputValue))}
         />
         <ToolbarButton
            text="-"
            command={() => updateColumnIndex(parseInt(columnIndexInputValue) - 1)}
         />
         {/* <ToolbarInput
            value={columnIndexInputValue}
            onChange={(e) => setColumnIndexInputValue(e.target.value)}
            onBlur={() => updateColumnIndex(parseInt(columnIndexInputValue))}
            /> */}
         <ToolbarButton
            text="+"
            command={() => updateColumnIndex(parseInt(columnIndexInputValue) + 1)}
         />
      </div>
   )
}

export default ColumnIndex;