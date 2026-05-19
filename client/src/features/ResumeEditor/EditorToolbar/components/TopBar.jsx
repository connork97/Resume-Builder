import React, { useState, useEffect, forwardRef, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';


import { setResume, updateResume } from '@/store/resumeSlice.js';
import { getResumeFromApi, saveResumeToApi } from '@/services/resumeServices';

import styles from './TopBar.module.css';
import CurrentlyEditing from './CurrentlyEditing';
import AddSection from './AddSection';

// const TopBar = forwardRef(function TopBar({  }, ref) {
const TopBar = ({ handlePrint }) => {

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
      setResumeTitle(resume?.title);
   }, [resume]);

   const handleSetResumeTitle = (e) => {
      const value = e.currentTarget.innerText.trim();

      setResumeTitle(value);
      dispatch(updateResume({
         key: 'title',
         changes: value
      }))
   }

   // const resumeRef = ref;

   // const [isPrinting, setIsPrinting] = useState(true);

   // const pageStyle = `
   //    @page {
   //       size: auto;
   //       margin: 20mm;
   //    }

   //    @media print {
   //       body {
   //          -webkit-print-color-adjust: exact;
   //       }
   //    }
   //    `;
   // const reactToPrint = useReactToPrint({
   //    documentTitle: resume.title,
   //    contentRef: resumeRef,
   //    pageStyle: pageStyle,
   //    onAfterPrint: () => {
   //       setIsPrinting(false);
   //    },
   // });

   // const handlePrint = () => {
   //    // setIsPrinting(false);
   //    setIsPrinting(true);

   //    setTimeout(async () => {
   //       reactToPrint();
   //    }, 500);
   // };

   return (
      <div className={styles.topBarContainer}>

         <div className={styles.topBarRow}>
            <div
               className={styles.topBarInput}
               contentEditable
               suppressContentEditableWarning
               onBlur={handleSetResumeTitle}
            >
               {resumeTitle}
            </div>
            <div className={styles.topBarFlexWrapper}>
               <CurrentlyEditing />
               <AddSection />
            </div>
            <div className={styles.topBarFlexWrapper}>

               <button
                  className={styles.topBarButton}
                  onClick={saveResume}
               >
                  Save Resume
               </button>
               <button
                  className={styles.topBarButton}
                  onClick={handlePrint}
               >
                  Print
               </button>
            </div>
         </div>
      </div>
   )
}
// )

export default TopBar;