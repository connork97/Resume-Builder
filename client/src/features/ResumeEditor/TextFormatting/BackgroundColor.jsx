import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '../../../store/resumeSlice.js';

import ToolbarDropdown from '../EditorToolbar/components/shared/ToolbarDropdown.jsx';
import ColorDropdown from './shared/ColorDropdown.jsx';

const BackgroundColor = () => {

   const dispatch = useDispatch();
   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const sectionBackgroundColor = useSelector(state => state.resume.sections.byId[activeSectionId]?.styling?.backgroundColor);

   const handleSetSectionBackgroundColor = (color) => {
      if (!activeSectionId) {
         dispatch(updateResume({
            key: 'styling',
            changes: {
               backgroundColor: color
            }
         }))
         return;
      }
      dispatch(updateSection({
         id: activeSectionId,
         changes: { styling: { backgroundColor: color } }
      }));
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