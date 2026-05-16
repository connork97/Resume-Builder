import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateSectionFlex, updateSubsectionFlexDirection } from '@/store/resumeSlice.js';

import ToolbarButton from '../../EditorToolbar/components/shared/ToolbarButton';
import styles from '../SettingsModal.module.css';
import SectionFlexDirection from './SectionFlexDirection';

const SectionJustifyContent = () => {
   const dispatch = useDispatch();

   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);

   const handleJustifyContentChange = (e) => {
      console.log(e.target)
      const newJustifyContent = e.target.value;
      dispatch(updateSectionFlex({
         id: section.id,
         changes: {
            display: 'flex',
            justifyContent: newJustifyContent
         }
      }))
   };

   return (
      <div className={styles.settingsModalRow}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="justifyContentOptions">Section Justify Content:</label>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
               <ToolbarButton
                  text="Start"
                  value='start'
                  command={handleJustifyContentChange}
               />
               <ToolbarButton
                  text="End"
                  value='end'
                  command={handleJustifyContentChange}
               />
               <ToolbarButton
                  text="Center"
                  value='center'
                  command={handleJustifyContentChange}
               />
               <ToolbarButton
                  text="Space Evenly"
                  value='space-evenly'
                  command={handleJustifyContentChange}
               />
               <ToolbarButton
                  text="Space Between"
                  value='space-between'
                  command={handleJustifyContentChange}
               />
               <ToolbarButton
                  text="Space Around"
                  value='space-around'
                  command={handleJustifyContentChange}
               />
            </div>
         </div>
      </div>
   );
};

export default SectionJustifyContent;