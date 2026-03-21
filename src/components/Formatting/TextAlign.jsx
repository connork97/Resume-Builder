import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';
import { setAlignment } from "../../helpers/blocks.js";

import ToolbarButton from "../Toolbar/ToolbarButton.jsx";

const TextAlign = ({ editor }) => {

   const dispatch = useDispatch();
   const activeSectionId = useSelector(state => state.resume.activeSectionId);

   const handleSetTextAlign = (editor, alignment) => {
      if (!editor && !activeSectionId) {
         dispatch(updateResumeStyling({ textAlign: alignment }));
         return;
      } else if (!editor && activeSectionId) {
         dispatch(updateSection({
            sectionId: activeSectionId,
            changes: { styling: { textAlign: alignment } }
         }));
         return;
      } else if (editor) {
         setAlignment(editor, alignment);
      }
   }

   return (

      <>
         <ToolbarButton
            text="L"
            command={() => handleSetTextAlign(editor, 'left')}
         />
         <ToolbarButton
            text="C"
            command={() => handleSetTextAlign(editor, 'center')}
         />
         <ToolbarButton
            text="R"
            command={() => handleSetTextAlign(editor, 'right')}
         />
         <ToolbarButton
            text="J"
            command={() => handleSetTextAlign(editor, 'justify')}
         />
      </>
   )
}

export default TextAlign;