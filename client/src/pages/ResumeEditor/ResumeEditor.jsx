import React from 'react';

import { Link } from 'react-router-dom';

import Toolbar from '../../components/Toolbar/Toolbar.jsx';
import Outline from '../../components/Outline/Outline.jsx';
import Page from '../../components/Page/Page.jsx';

import styles from './ResumeEditor.module.css';

const ResumeEditor = ({ resumeId }) => {
   return (
      <div className={styles.resumeEditorContainer}>
         <div className={styles.toolbarLinksWrapper}>
            <Link to='/home' className={styles.homeButton}>Home</Link>
            <Link to='/home' className={styles.homeButton}>Account V</Link>
         </div>
         <Toolbar />
         {/* <Outline /> */}
         <Page resumeId={resumeId} />
      </div>
   )
};

export default ResumeEditor;