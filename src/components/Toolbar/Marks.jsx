import React from 'react';

import { toggleMark } from "../Slate/helpers/marks.js";

import ToolbarButton from "./ToolbarButton";

const Marks = ({ editor }) => {
   return (
      <>
         <ToolbarButton
            text="B"
            styling={{ fontWeight: 'bold' }}
            command={() => editor && toggleMark(editor, "bold")}
         />
         <ToolbarButton
            text="I"
            styling={{ fontStyle: 'italic' }}
            command={() => editor && toggleMark(editor, "italic")}
         />
         <ToolbarButton
            text="U"
            styling={{ textDecoration: 'underline' }}
            command={() => editor && toggleMark(editor, "underline")}
         />
         <ToolbarButton
            text="S"
            styling={{ textDecoration: 'line-through' }}
            command={() => editor && toggleMark(editor, "strikeThrough")}
         />
      </>
   )
}

export default Marks;