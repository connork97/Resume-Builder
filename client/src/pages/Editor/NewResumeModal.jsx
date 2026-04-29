import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BASE_URL } from '../../config';

import { setResumeId } from '../../store/resumeSlice';

import styles from './NewResumeModal.module.css';

const NewResumeModal = ({ onClose }) => {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.user);

   const [resumeInfo, setResumeInfo] = useState({
      userId: user.id,
      title: '',
      sections: {
         header: false,
         contact: false,
         skills: false,
         summary: false,
         workHistory: false,
         education: false,
      },
   });

   const handleResumeInfoChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
         setResumeInfo((prevInfo) => ({
            ...prevInfo,
            sections: {
               ...prevInfo.sections,
               [name]: checked,
            },
         }));
      } else {
         setResumeInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
         }));
      }
   };

   const handleCreateResume = async () => {
      // if (!resumeInfo.title) {
      //    alert('Please enter a title for your resume.');
      //    return;
      // }
      if (confirm('Are you sure you want to create a new resume?')) {
         console.log('Creating resume with info:', resumeInfo);
         try {
            const response = await fetch(`${BASE_URL}/resumes`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               credentials: 'include',
               body: JSON.stringify(resumeInfo),
            });
            const data = await response.json();
            if (!response.ok) {
               throw data?.error;
            }
            console.log('Resume created successfully:', data);
            dispatch(setResumeId(data.id));
            onClose();
            navigate(`/editor/${data.id}`);

         } catch (error) {
            console.error('Error creating resume:', error);
            alert(error.code + '\n' + error.message)
         }
      }
   };

   return (
      <div className={styles.modalOverlayContainer}>
         <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.resumeInfoWrapper}>
               <h2 className={styles.startResumeTitle}>Start a New Resume</h2>
               <label
                  htmlFor="title"
                  className={styles.inputLabel}
               >
                  <span className={styles.primarySpan}>Resume Title:</span>
                  <input
                     id="title"
                     type="text"
                     name="title"
                     className={styles.resumeInfoInput}
                     placeholder="e.g. Software Engineer Resume"
                     value={resumeInfo.title}
                     onChange={(e) => handleResumeInfoChange(e)}
                  />
               </label>
               <div className={styles.sectionsToIncludeWrapper}>
                  <p>
                     <span className={styles.primarySpan}>Sections to Include:</span>
                     <br></br>
                     <span>(You can always change this later)</span>
                  </p>
                  <div className={styles.checkboxOptionsWrapper}>
                     <label
                        htmlFor='header'
                        className={styles.checkboxLabel}
                     >
                        <input
                           id="header"
                           type="checkbox"
                           name="header"
                           className={styles.sectionCheckbox}
                           checked={resumeInfo.sections.header || false}
                           onChange={(e) => handleResumeInfoChange(e)}
                        />
                        Header (Name, Job Title)
                     </label>
                     <label
                        htmlFor='contact'
                        className={styles.checkboxLabel}
                     >
                        <input
                           id="contact"
                           type="checkbox"
                           name="contact"
                           className={styles.sectionCheckbox}
                           checked={resumeInfo.sections.contact || false}
                           onChange={(e) => handleResumeInfoChange(e)}
                        />
                        Contact Information
                     </label>
                     <label
                        htmlFor='skills'
                        className={styles.checkboxLabel}
                     >
                        <input
                           id="skills"
                           type="checkbox"
                           name="skills"
                           className={styles.sectionCheckbox}
                           checked={resumeInfo.sections.skills || false}
                           onChange={(e) => handleResumeInfoChange(e)}
                        />
                        Skills
                     </label>
                     <label
                        htmlFor='summary'
                        className={styles.checkboxLabel}
                     >
                        <input
                           id="summary"
                           type="checkbox"
                           name="summary"
                           className={styles.sectionCheckbox}
                           checked={resumeInfo.sections.summary || false}
                           onChange={(e) => handleResumeInfoChange(e)}
                        />
                        Summary
                     </label>
                     <label
                        htmlFor='workHistory'
                        className={styles.checkboxLabel}
                     >
                        <input
                           id="workHistory"
                           type="checkbox"
                           name="workHistory"
                           className={styles.sectionCheckbox}
                           checked={resumeInfo.sections.workHistory || false}
                           onChange={(e) => handleResumeInfoChange(e)}
                        />
                        Work History
                     </label>
                     <label
                        htmlFor='education'
                        className={styles.checkboxLabel}
                     >
                        <input
                           id="education"
                           type="checkbox"
                           name="education"
                           className={styles.sectionCheckbox}
                           checked={resumeInfo.sections.education || false}
                           onChange={(e) => handleResumeInfoChange(e)}
                        />
                        Education
                     </label>
                  </div>
               </div>
               <button
                  className={styles.createResumeButton}
                  onClick={handleCreateResume}>
                  Create Resume
               </button>
            </div>
            {/* <p>Choose a template to get started:</p>
            <div className={styles.templateOptions}>
               <button className={styles.templateButton}>Template 1</button>
               <button className={styles.templateButton}>Template 2</button>
               <button className={styles.templateButton}>Template 3</button>
            </div> */}
         </div>
      </div>
   );
};

export default NewResumeModal;