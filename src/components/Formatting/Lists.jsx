import React from 'react';

import { toggleList } from '../../helpers/blocks';

import ToolbarButton from '../Toolbar/shared/ToolbarButton';

const Lists = ({ editor }) => {
   return (
      <>
      <ToolbarButton
        text="•"
        command={() => editor && toggleList(editor, "unordered-list")}
      />

      <ToolbarButton
        text="1."
        command={() => editor && toggleList(editor, "ordered-list")}
      />
      </>
   )
}

export default Lists;