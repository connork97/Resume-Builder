import React, { useState, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import Toolbar from '../../components/Toolbar/Toolbar.jsx';
import Outline from '../../components/Outline/Outline.jsx';
import Page from '../../components/Page/Page.jsx';

import NewResumeModal from './NewResumeModal.jsx';

import styles from './ResumeEditor.module.css';

const ResumeEditor = ({ resumeId }) => {

   const location = useLocation();
   console.log('Current location:', location);

   const [showNewResumeModal, setShowNewResumeModal] = useState(false);

   useEffect(() => {
      if (location.pathname === '/editor/new') {
         setShowNewResumeModal(true);
      } else {
         setShowNewResumeModal(false);
      }
   }, [location.pathname]);
   
   return (
      <div className={styles.resumeEditorContainer}>
         <div className={styles.toolbarLinksWrapper}>
            <Link to='/home' className={styles.homeButton}>Home</Link>
            {/* <Link to='/home' className={styles.homeButton}>Account V</Link> */}
         </div>
         <Toolbar />
         {/* <Outline /> */}
         <Page resumeId={resumeId} />
         {showNewResumeModal && <NewResumeModal onClose={() => setShowNewResumeModal(false)} />} {/* Placeholder for modal state management */}
      </div>
   )
};

export default ResumeEditor;