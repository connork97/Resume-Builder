import React from 'react';

import { toggleList } from '../../../helpers/blocks';

import styles from './TextFormatting.module.css';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';

const Lists = ({ editor }) => {
  return (
    <div className={styles.toolbarFlexWrapper}>
      <button
        className='buttonMain'
        onClick={() => editor && toggleList(editor, "unordered-list")}
      >
        <MdFormatListBulleted style={{position: 'relative', top: '0.1em'}} />
        </button>

      <button
        className='buttonMain'
        onClick={() => editor && toggleList(editor, "ordered-list")}
      >
        <MdFormatListNumbered style={{position: 'relative', top: '0.1em'}} />
      </button>
    </div>
  )
}

export default Lists;