import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Node } from 'slate';
import { setActiveEditorId, setActiveSectionId } from '@/store/resumeSlice.js';

import ToolbarButton from "./shared/ToolbarButton.jsx";

const CurrentlyEditing = ({ editor }) => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const activeSectionId = useSelector(state => state.resume.activeSectionId);

   const activeEditorText = editor ? Node.string(editor) : null;
   const activeEditorLabel = editor?.children[0].label;
   
   const activeSection = sections.byId[activeSectionId];
   const activeSectionText = activeSection ? Node.string({ children: activeSection?.value ?? [] }) : null;

   const [currentlyEditingText, setCurrentlyEditingText] = useState('Full Resume');

   useEffect(() => {
      if (activeSectionText && activeEditorText && activeSectionText !== activeEditorText) {
         setCurrentlyEditingText(`${activeSectionText} > ${activeEditorLabel}`);
      } else if (activeEditorText) {
         setCurrentlyEditingText(activeEditorText);
      } else if (activeSectionText) {
         setCurrentlyEditingText(activeSectionText);
      } else {
         setCurrentlyEditingText('Full Resume');
      }
   }, [activeSectionText, activeEditorText])


   const clearToolbarSelection = () => {
      dispatch(setActiveEditorId(null));
      dispatch(setActiveSectionId(null));
   }
   return (
      <ToolbarButton
         text={`Currently Editing: ${currentlyEditingText}`}
         command={() => { clearToolbarSelection() }}
      />
   )
}

export default CurrentlyEditing;