import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { setUser } from "../../store/userSlice.js";

import { BASE_URL } from "../../config.js";

import styles from './UserResumesDropdown.module.css';

const UserResumesDropdown = () => {

   const dispatch = useDispatch();

   const user = useSelector((state) => state.user);

   const deleteUserResume = async (resumeId, resumeTitle) => {
      if (confirm(`This will permanently delete the resume "${resumeTitle}". Are you sure?`)) {
         try {
            const response = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
               method: 'DELETE'
            });
            if (response.ok) {
               dispatch(
                  setUser(
                     {
                        ...user,
                        resumes: user.resumes.filter(
                           (resume) => resume.id !== resumeId
                        )
                     }
                  )
               );
            }
            else if (!response.ok) {
               throw data?.error;
            }
         } catch (error) {
            console.error('Error deleting resume:', error);
            alert(error.code + '\n' + error.message || 'Error deleting resume.');
         }
      }
   }

   const userResumes = user.resumes.map((resume) => (
      <div key={resume.id} className={styles.userResumeDropdownRow}>
         <p key={resume.id} className={styles.userResumeDropdownItem}>
            {resume.title}
         </p>
         <button className={styles.userResumeViewButton}>
            Edit
         </button>
         <button
            className={styles.userResumeDeleteButton}
            onClick={() => deleteUserResume(resume.id, resume.title)}
         >
            Delete
         </button>
      </div>
   ));

   return (
      <div className={styles.userResumesDropdownContainer}>
         {user.resumes.length > 0
            ? userResumes
            : <p className={styles.userResumeDropdownItem}>No resumes found.</p>
         }
      </div>
   )
}

export default UserResumesDropdown;