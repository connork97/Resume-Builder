import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateSectionFlexDirection, updateSubsectionFlexDirection } from '@/store/resumeSlice.js';

import ToolbarButton from '../../EditorToolbar/components/shared/ToolbarButton';
import styles from '../SettingsModal.module.css';

const SectionFlexDirection = () => {
   const dispatch = useDispatch();

   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const section = useSelector(state => state.resume.sections.byId[activeSectionId]);
   const subsectionIds = section.subsectionIds || [];
   const subsections = useSelector(state => subsectionIds.map(id => state.resume.subsections.byId[id]));

   const handleFlexDirectionChange = (e) => {
      const newFlexDirection = e.target.value;
      dispatch(updateSectionFlexDirection({
         id: section.id,
         flexDirection: newFlexDirection
      }))
      section.subsectionIds.forEach(subsectionId => {
         dispatch(updateSubsectionFlexDirection({ id: section.id, flexDirection: newFlexDirection }));
      });
   };

   return (
      <div className={styles.settingsModalRow}>
         <label htmlFor="flex-direction-select">Section Flex Direction:</label>
         <ToolbarButton
            text="Row"
            command={handleFlexDirectionChange}
         >
            Row
         </ToolbarButton>
         <ToolbarButton
            text="Column"
            command={handleFlexDirectionChange}
         >
            Column
         </ToolbarButton>
      </div>
   );
};

export default SectionFlexDirection;