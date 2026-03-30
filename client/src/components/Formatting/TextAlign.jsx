import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResumeStyling, updateSection } from '../../store/resumeSlice.js';
import { setAlignment } from "../../helpers/blocks.js";

import ToolbarButton from "../Toolbar/shared/ToolbarButton.jsx";

const TextAlign = ({ editor, styling }) => {

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

      <div style={{...styling, display: 'flex', justifyContent: 'center', gap: '0.25rem'}}>
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
      </div>
   )
}

export default TextAlign;