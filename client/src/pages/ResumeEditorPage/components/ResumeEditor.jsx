import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';

import normalizeResumeFromApi from '@/utils/normalizeResumeFromApi';

import { BASE_URL } from '@/config.js';

import { setResume, updateResumeTitle } from '@/store/resumeSlice.js';

import Toolbar from '@/features/ResumeEditor/EditorToolbar/Toolbar.jsx';
import Outline from '@/features/ResumeEditor/EditorOutline/Outline.jsx';
import NewResumeModal from '@/features/ResumeEditor/NewResumeModal/NewResumeModal.jsx';

import styles from './ResumeEditor.module.css';
import AutoWidthInput from '@/components/AutoWidthInput.jsx';
import ResumePaper from '@/features/ResumeEditor/ResumePaper/ResumePaper.jsx';
import { getResumeFromApi, saveResumeToApi } from '@/services/resumeServices';

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
      const normalizedResumeData = await getResumeFromApi(resumeId);
      if (!normalizedResumeData) {
         return;
      }

      dispatch(setResume(normalizedResumeData));
   }

   useEffect(() => {
      if (resumeId) fetchResumeById(resumeId);
   }, [resumeId])

   const saveResume = async () => {
      const resumeIsSaved = await saveResumeToApi(resume);
      if (!resumeIsSaved) {
         return;
      }

      alert('Resume saved successfully!');
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
         <Outline />
         <ResumePaper />
         {showNewResumeModal &&
            <NewResumeModal onClose={() => setShowNewResumeModal(false)} />
         }
      </div>
   )
};

export default ResumeEditor;