import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';

import ToolbarDropdown from "../Toolbar/ToolbarDropdown.jsx";

const BackgroundColor = () => {

   const dispatch = useDispatch();
   const activeSectionId = useSelector(state => state.resume.activeSectionId);

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