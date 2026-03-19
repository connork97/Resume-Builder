import React from 'react';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';

import ToolbarDropdown from "./ToolbarDropdown";

const BackgroundColor = ({ dispatch, activeSectionId }) => {

   const handleSetSectionBackgroundColor = (color) => {
      if (!activeSectionId) {
         dispatch(updateResumeStyling({ backgroundColor: color }));
         return;
      }
      dispatch(updateSection({
         sectionId: activeSectionId,
         changes: { styling: { backgroundColor: color } }
      }));
   };

   return (
      <ToolbarDropdown
         text="BC"
         handleSetColor={handleSetSectionBackgroundColor}
      />
   )
}

export default BackgroundColor;