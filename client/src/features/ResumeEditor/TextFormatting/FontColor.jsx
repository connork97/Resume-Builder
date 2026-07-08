import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';

import { getActiveMark, setFontColor } from "../../../helpers/marks.js";
import { updateResume, updateSection } from "@/store/resumeSlice.js";

import ColorDropdown from "./shared/ColorDropdown.jsx";

const FontColor = ({ editor, selection }) => {

   const dispatch = useDispatch();

   const resume = useSelector(state => state.resume);

   const activeEditorId = useSelector(state => state.resume.activeEditorId)
   const activeSectionId = useSelector(state => state.resume.activeSectionId);
   const activeSectionIds = useSelector(state => state.resume.activeSectionIds);

   const activeField = useSelector(state => state.resume.fields.byId[activeEditorId])
   const activeSubsection = useSelector(state => state.resume.subsections.byId[activeField?.subsectionId])
   const activeSection = useSelector(state => state.resume.sections.byId[activeSectionId])
   const activeColumn = useSelector(state => state.resume.columns.byId[activeSection?.columnId]);
   // const activeSection = useSelector(state => state.resume.sections.byId[activeSectionId]);
   // const activeSection = activeSectionIds[0]

   // const activeEditor = 

   const [currentFontColor, setCurrentFontColor] = useState('rgba(0, 0, 0, 1)');

   useEffect(() => {
      if (!editor || !selection) return;
      // console.log(getActiveMark(editor, 'color'))
      // console.log('selection', selection)
      const editorFontColor = getActiveMark(editor, 'color');
      const fieldFontColor = activeField?.styling?.color;
      const subsectionFontColor = activeSubsection?.styling?.color;
      const sectionFontColor = activeSection?.styling?.color;
      const columnFontColor = activeColumn?.styling?.color;
      const resumeFontColor = resume?.styling?.color;

      if (editorFontColor) setCurrentFontColor(editorFontColor);
      else if (fieldFontColor) setCurrentFontColor(fieldFontColor);
      else if (subsectionFontColor) setCurrentFontColor(subsectionFontColor);
      else if (sectionFontColor) setCurrentFontColor(sectionFontColor);
      else if (columnFontColor) setCurrentFontColor(columnFontColor);
      else if (resumeFontColor) setCurrentFontColor(resumeFontColor);
      else setCurrentFontColor('rgba(0, 0, 0, 0)');


   }, [editor, selection, activeEditorId, activeField, activeSubsection, activeSection, activeColumn])

   const setNewFontColor = (newFontColor = currentFontColor) => {
      if (activeSectionIds.length > 0) {
         for (let sectionId of activeSectionIds) {
            dispatch(updateSection({
               id: sectionId,
               changes: { styling: { color: newFontColor } }
            }));
         }
      } if (activeSectionId && !editor) {
         dispatch(updateSection({
            id: activeSectionId,
            changes: { styling: { color: newFontColor } }
         }));
      } if (editor) {
         setFontColor(editor, newFontColor);
      } if (!editor && !activeSectionId && !(activeSectionIds.length > 0)) {
         dispatch(updateResume({
            key: 'styling',
            changes: {
               color: newFontColor
            }
         }))
      }
      setCurrentFontColor(newFontColor);
   }

   return (
      <ColorDropdown
         text="A"
         editor={editor}
         selection={selection}
         currentEditorColor={currentFontColor}
         handleSetColor={setNewFontColor}
      />
   )
}

export default FontColor;
