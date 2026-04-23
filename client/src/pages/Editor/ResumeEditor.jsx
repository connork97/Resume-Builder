import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';

import normalizeResumeFromApi from '../../utils/normalizeResumeFromApi.js';

import { BASE_URL } from '../../config.js';

import { setResume } from '../../store/resumeSlice.js';

import Toolbar from '../../components/Toolbar/Toolbar.jsx';
import Outline from '../../components/Outline/Outline.jsx';
import Page from './Page/Page.jsx';
import NewResumeModal from './NewResumeModal.jsx';

import styles from './ResumeEditor.module.css';

const ResumeEditor = () => {

   const location = useLocation();
   const dispatch = useDispatch();
   const { resumeId } = useParams();
   
   const resume = useSelector(state => state.resume)

   const [showNewResumeModal, setShowNewResumeModal] = useState(false);

   useEffect(() => {
      if (location.pathname === '/editor/new') {
         setShowNewResumeModal(true);
      } else {
         setShowNewResumeModal(false);
      }
   }, [location.pathname]);

   const fetchResumeById = async (resumeId) => {
      try {
         const response = await fetch(`${BASE_URL}/resumes/${resumeId}`)
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const resumeData = await response.json();
         const normalizedResume = normalizeResumeFromApi(resumeData);
         dispatch(setResume(normalizedResume));
      } catch (error) {
         console.error(`Error fetching resume of id ${resumeId}: `, error)
      }
   }

   useEffect(() => {
      if (resumeId) fetchResumeById(resumeId);
   }, [resumeId])

   return (
      <div className={styles.resumeEditorContainer}>
         <div className={styles.toolbarLinksWrapper}>
            <Link to='/home' className={styles.homeButton}>Home</Link>
            {/* <Link to='/home' className={styles.homeButton}>Account V</Link> */}
         </div>
         <Toolbar />
         {/* <Outline /> */}
         <Page />
         {showNewResumeModal &&
            <NewResumeModal onClose={() => setShowNewResumeModal(false)} />
         } {/* Placeholder for modal state management */}
      </div>
   )
};

export default ResumeEditor;