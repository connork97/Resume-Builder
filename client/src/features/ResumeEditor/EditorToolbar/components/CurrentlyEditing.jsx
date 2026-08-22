import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Node } from 'slate';
import { setActiveEditorId, setActiveSectionId } from '@/store/resumeSlice.js';

import { editorRegistry } from '@/helpers/editorRegistry.js';
import { getNodeString } from '@/helpers/getNodeString';

const CurrentlyEditing = () => {

   const dispatch = useDispatch();

   const sections = useSelector(state => state.resume.sections);
   const reduxSubsections = useSelector(state => state.resume.subsections);
   const activeSectionIds = useSelector(state => state.resume.activeSectionIds);
   const activeSectionId = activeSectionIds[0] ?? null;
   const activeEditorId = useSelector((state) => state.resume.activeEditorId);
   const reduxField = useSelector(state => state.resume.fields.byId[activeEditorId]);
   const reduxFieldSubsection = reduxSubsections.byId[reduxField?.subsectionId];
   const reduxFieldIndex = reduxFieldSubsection?.fieldIds?.indexOf(activeEditorId);
   const editor = editorRegistry.get(activeEditorId);
   const activeEditorText = editor ? Node.string(editor) : null;
   const activeEditorLabel = reduxField?.label || editor?.children[0].label || editor?.label || 'Field' + reduxFieldIndex || 'Field';

   const activeSection = sections.byId[activeSectionId];
   const activeSectionText = activeSection ? getNodeString(activeSection) : null;
   // const activeSectionText = activeSection ? Node.string({ children: activeSection?.value ?? [] }) : null;

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