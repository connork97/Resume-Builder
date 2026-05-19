import React from 'react';

import { toggleList } from '../../../helpers/blocks';

import ToolbarButton from '../EditorToolbar/components/shared/ToolbarButton';
import TextFormatButton from './shared/TextFormatButton';

import styles from './TextFormatting.module.css';

const Lists = ({ editor }) => {
  return (
    <div className={styles.toolbarFlexWrapper}>
      <TextFormatButton
        text="•"
        command={() => editor && toggleList(editor, "unordered-list")}
      />

      <TextFormatButton
        text="1."
        command={() => editor && toggleList(editor, "ordered-list")}
      />
    </div>
  )
}

export default Lists;