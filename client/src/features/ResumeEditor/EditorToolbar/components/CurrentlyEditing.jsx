import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Node } from 'slate';
import { setActiveEditorId, setActiveSectionId } from '@/store/resumeSlice.js';

import { editorRegistry } from '@/helpers/editorRegistry.js';

const CurrentlyEditing = () => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const activeEditorId = useSelector((state) => state.resume.activeEditorId);
   const editor = editorRegistry.get(activeEditorId);
   const activeEditorText = editor ? Node.string(editor) : null;
   const activeEditorLabel = editor?.children[0].label;

   const activeSection = sections.byId[activeSectionId];
   const activeSectionText = activeSection ? Node.string({ children: activeSection?.value ?? [] }) : null;

   const [currentlyEditingText, setCurrentlyEditingText] = useState('Full Resume');

   useEffect(() => {
      if (activeSectionText && activeEditorText && activeSectionText !== activeEditorText) {
         setCurrentlyEditingText(`${activeSectionText} > ${activeEditorLabel}`);
      } else if (activeEditorText) {
         // setCurrentlyEditingText(activeEditorText);
         setCurrentlyEditingText(activeEditorLabel);         
      } else if (activeSectionText) {
         setCurrentlyEditingText(activeSectionText);
      } else {
         setCurrentlyEditingText('Full Resume');
      }
   }, [activeSectionText, activeEditorText, activeEditorLabel])


   const clearToolbarSelection = () => {
      dispatch(setActiveEditorId(null));
      dispatch(setActiveSectionId(null));
   }
   return (
      <button className='buttonMain' onClick={() => clearToolbarSelection()}>{`Currently Editing: ${currentlyEditingText}`}</button>
   )
}

export default CurrentlyEditing;