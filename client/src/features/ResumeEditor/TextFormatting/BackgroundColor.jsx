import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '../../../store/resumeSlice.js';

import ColorDropdown from './shared/ColorDropdown.jsx';

const BackgroundColor = () => {

   const dispatch = useDispatch();
   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const activeSectionIds = useSelector(state => state.resume.activeSectionIds);
   const sectionBackgroundColor = useSelector(state => state.resume.sections.byId[activeSectionId]?.styling?.backgroundColor);

   const handleSetSectionBackgroundColor = (color) => {
      if (activeSectionIds) {
         for (let sectionId of activeSectionIds) {
            dispatch(updateSection({
               id: sectionId,
               changes: { styling: { backgroundColor: color } }
            }));
         }
      } else if (!activeSectionIds && !activeSectionId) {
         dispatch(updateResume({
            key: 'styling',
            changes: {
               backgroundColor: color
            }
         }))
         return;
      } else if (!activeSectionIds && activeSectionId) {
         dispatch(updateSection({
            id: sectionId,
            changes: { styling: { backgroundColor: color } }
         }));
      }
   };

   return (
      <ColorDropdown
         text="BC"
         currentEditorColor={sectionBackgroundColor}
         handleSetColor={handleSetSectionBackgroundColor}
      />
   )
}

export default BackgroundColor;