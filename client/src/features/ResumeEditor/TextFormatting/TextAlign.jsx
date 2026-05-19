import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateResume, updateSection } from '@/store/resumeSlice.js';

import { setAlignment } from '@/helpers/blocks.js';

import ToolbarButton from '../EditorToolbar/components/shared/ToolbarButton.jsx';
import TextFormatButton from './shared/TextFormatButton.jsx';

import styles from './TextFormatting.module.css';

const TextAlign = ({ editor, styling }) => {

   const dispatch = useDispatch();
   const activeSectionId = useSelector(state => state.resume.activeSectionId);

   const handleSetTextAlign = (editor, alignment) => {
      if (!editor && !activeSectionId) {
         dispatch(updateResume({
            key: 'styling',
            changes: {
               textAlign: alignment
            }
         }))
         return;
      } else if (!editor && activeSectionId) {
         dispatch(updateSection({
            id: activeSectionId,
            changes: { styling: { textAlign: alignment } }
         }));
         return;
      } else if (editor) {
         setAlignment(editor, alignment);
      }
   }

   return (

      <div className={styles.toolbarFlexWrapper}>
         <TextFormatButton
            text="L"
            command={() => handleSetTextAlign(editor, 'left')}
         />
         <TextFormatButton
            text="C"
            command={() => handleSetTextAlign(editor, 'center')}
         />
         <TextFormatButton
            text="R"
            command={() => handleSetTextAlign(editor, 'right')}
         />
         <TextFormatButton
            text="J"
            command={() => handleSetTextAlign(editor, 'justify')}
         />
      </div>
   )
}

export default TextAlign;