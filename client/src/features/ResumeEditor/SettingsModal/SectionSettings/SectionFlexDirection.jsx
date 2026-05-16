import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateSection, updateSubsectionFlexDirection } from '@/store/resumeSlice.js';

import ToolbarButton from '../../EditorToolbar/components/shared/ToolbarButton';
import styles from '../SettingsModal.module.css';

const SectionFlexDirection = () => {
   const dispatch = useDispatch();

   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);

   const handleFlexDirectionChange = (e) => {
      const newFlexDirection = e.target.value;
      console.log('FLEX DIRECTION', newFlexDirection)
      dispatch(updateSection({
         id: section.id,
         changes: {
            layout: {
               display: 'flex',
               flexDirection: newFlexDirection,
            }
         }
      }))
   };

   return (
      <div className={styles.settingsModalRow}>
         <label htmlFor="flex-direction-select">Section Flex Direction:</label>
         <ToolbarButton
            text="Row"
            value='row'
            command={handleFlexDirectionChange}
         >
         </ToolbarButton>
         <ToolbarButton
            text="Column"
            value='column'
            command={handleFlexDirectionChange}
         >
         </ToolbarButton>
      </div>
   );
};

export default SectionFlexDirection;