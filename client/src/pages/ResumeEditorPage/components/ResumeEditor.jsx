import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { setResume } from '@/store/resumeSlice.js';

import Toolbar from '@/features/ResumeEditor/EditorToolbar/Toolbar.jsx';
import Outline from '@/features/ResumeEditor/EditorOutline/Outline.jsx';
import NewResumeModal from '@/features/ResumeEditor/NewResumeModal/NewResumeModal.jsx';

import ResumePaper from '@/features/ResumeEditor/ResumePaper/ResumePaper.jsx';
import { getResumeFromApi } from '@/services/resumeServices';
import { useReactToPrint } from 'react-to-print';

import styles from './ResumeEditor.module.css';
import MarginRuler from '@/features/ResumeEditor/ResumePaper/components/MarginRuler';

const ResumeEditor = () => {

   const location = useLocation();
   const dispatch = useDispatch();
   const { resumeId } = useParams();

   const resume = useSelector(state => state.resume)

   const showNewResumeModal = location.pathname === '/editor/new';
   
   const fetchResumeById = useCallback(
      async (resumeId) => {
         const normalizedResumeData = await getResumeFromApi(resumeId);
         if (!normalizedResumeData) {
            return;
         }

         dispatch(setResume(normalizedResumeData));
      }, [dispatch]);

   useEffect(() => {
      if (resumeId) fetchResumeById(resumeId);
   }, [resumeId, fetchResumeById])

   const resumeRef = useRef(null);

   const [isPrinting, setIsPrinting] = useState(false);

   const pageStyle = `
      @page {
         size: auto;
         margin: 20mm;
      }

      @media print {
         body {
            -webkit-print-color-adjust: exact;
         }
      }
      `;
   const reactToPrint = useReactToPrint({
      documentTitle: resume.title,
      contentRef: resumeRef,
      pageStyle: pageStyle,
      onAfterPrint: () => {
         setIsPrinting(false);
      },
   });


   // const handlePrint = () => {
      // setIsPrinting(true);
      // reactToPrint()
   // }
   // const handlePrint = useReactToPrint({
      // contentRef: resumeRef
   // })

   const handlePrint = () => {

      setIsPrinting(true);

      setTimeout(async () => {
         reactToPrint();
      }, 500);
   };

   return (
      <div className={styles.resumeEditorContainer}>
         <Toolbar handlePrint={handlePrint} />
         <Outline />
         <ResumePaper ref={resumeRef} isPrinting={isPrinting} />
         <MarginRuler />
         {showNewResumeModal &&
            <NewResumeModal />
         }
      </div>
   )
};

export default ResumeEditor;