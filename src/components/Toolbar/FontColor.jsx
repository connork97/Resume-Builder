import React, { useState, useEffect } from "react";

import { useDispatch } from 'react-redux';

import { getActiveMark, setFontColor } from "../Slate/helpers/marks.js";
import { updateResumeStyling, updateSection } from "../../store/resumeSlice.js";

import ToolbarDropdown from "./ToolbarDropdown";

const FontColor = ({ editor, selection, activeSectionId }) => {

   const dispatch = useDispatch();
   
   const [currentEditorFontColor, setCurrentEditorFontColor] = useState('rgba(0, 0, 0, 1)');

   useEffect(() => {
      if (!editor || !selection) return;

      const currentFontColor = getActiveMark(editor, 'color');
      currentFontColor && setCurrentEditorFontColor(currentFontColor);
   }, [editor, selection])

   const setNewFontColor = (newFontColor = currentEditorFontColor) => {
      if (!editor && !activeSectionId) {
         dispatch(updateResumeStyling({ color: newFontColor }));
         setCurrentEditorFontColor(newFontColor);
         console.log("Updating section font color", activeSectionId, newFontColor);
         return;
      } else if (!editor && activeSectionId) {
         dispatch(updateSection({
            sectionId: activeSectionId,
            changes: { styling: { color: newFontColor } }
         }));
         setCurrentEditorFontColor(newFontColor);
         return;
      } else if (editor) {
         setFontColor(editor, newFontColor);
         setCurrentEditorFontColor(newFontColor);
      }
   }

   return (
      <ToolbarDropdown
         text="A"
         styling={{ fontWeight: 'bold', boxShadow: `0 -0.35vh 0 ${currentEditorFontColor} inset` }}
         handleSetColor={setNewFontColor}
      />
   )
}

export default FontColor;