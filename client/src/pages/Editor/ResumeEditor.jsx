import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';

import normalizeResumeFromApi from '../../utils/normalizeResumeFromApi.js';

import { BASE_URL } from '../../config.js';

import { setResume, updateResumeTitle } from '../../store/resumeSlice.js';

import Toolbar from './Toolbar/Toolbar.jsx';
import Outline from '../../components/Outline/Outline.jsx';
import Page from './Page/Page.jsx';
import NewResumeModal from './NewResumeModal.jsx';

import styles from './ResumeEditor.module.css';
import AutoWidthInput from '../../components/AutoWidthInput.jsx';

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
            throw data?.error;
         }
         const resumeData = await response.json();
         const normalizedResume = normalizeResumeFromApi(resumeData);
         console.log('NORMALIZED RESUME', normalizedResume)
         dispatch(setResume(normalizedResume));
      } catch (error) {
         console.error(`Error fetching resume of id ${resumeId}: `, error)
         alert(error.code + '\n' + error.message || error);
      }
   }

   useEffect(() => {
      if (resumeId) fetchResumeById(resumeId);
   }, [resumeId])

   const saveResume = async () => {
      try {
         const response = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(resume)
         });

         const data = response.json();

         if (!response.ok) {
            throw data?.error;
         }
         alert('Resume Saved Successfully!');
      } catch (error) {
         console.error('Error saving resume: ', error);
         alert(error.code + '\n' + error.message || 'Error saving resume.')
      }
   }

   const [resumeTitle, setResumeTitle] = useState(resume.title);

   useEffect(() => {
      // if (!resume) return;
      setResumeTitle(resume.title);
   }, [resume]);

   const handleSetResumeTitle = (e) => {
      const value = e.currentTarget.innerText.trim();

      setResumeTitle(value);
      dispatch(updateResumeTitle(value));
   }

   // useEffect(() => {
   // dispatch(updateResumeTitle(resumeTitle));
   // }, [resumeTitle])

   return (
      <div className={styles.resumeEditorContainer}>
         {/* <div className={styles.toolbarLinksWrapper}> */}
         <div className={styles.aboveToolbarRow}>
            <Link to='/home' className={styles.homeButton}>Home</Link>
            {/* </div> */}
            <div
               className={styles.resumeTitle}
               contentEditable
               suppressContentEditableWarning
               onBlur={handleSetResumeTitle}
            >
               {resumeTitle}
            </div>
            <button
               className={styles.saveResumeButton}
               onClick={saveResume}
            >
               Save Resume
            </button>
         </div>
         <Toolbar />
         {/* <Outline /> */}
         <Page />
         {showNewResumeModal &&
            <NewResumeModal onClose={() => setShowNewResumeModal(false)} />
         }
      </div>
   )
};

export default ResumeEditor;