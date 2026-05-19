import React from 'react';

import { toggleMark } from '../../../helpers/marks.js';

import ToolbarButton from '../EditorToolbar/components/shared/ToolbarButton.jsx';
import TextFormatButton from './shared/TextFormatButton.jsx';

const Marks = ({ editor }) => {
   return (
      <>
         <TextFormatButton
            text="B"
            styling={{ fontWeight: 'bold' }}
            command={() => editor && toggleMark(editor, "bold")}
         />
         <TextFormatButton
            text="I"
            styling={{ fontStyle: 'italic' }}
            command={() => editor && toggleMark(editor, "italic")}
         />
         <TextFormatButton
            text="U"
            styling={{ textDecoration: 'underline' }}
            command={() => editor && toggleMark(editor, "underline")}
         />
         <TextFormatButton
            text="S"
            styling={{ textDecoration: 'line-through' }}
            command={() => editor && toggleMark(editor, "strikeThrough")}
         />
      </>
   )
}

export default Marks;