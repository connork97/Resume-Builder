import React from 'react';

import { useSelector } from 'react-redux';

import { BASE_URL } from '../../../config';

import styles from '../Account.module.css';

const UserResumeRow = ({ resume, fetchUserResumes }) => {
   console.log('RESUME DATA', resume)

   const user = useSelector(state => state.user)

   const handleDeleteResume = async () => {
      try {
         const response = await fetch(`${BASE_URL}/resumes/${resume.id}`, {
            method: 'DELETE',
         })
         const data = await response.json();
         if (!response.ok) {
            throw new Error(data?.error || 'Failed to delete resume');
         }
         alert(data.code + '\n' + data.message)
         fetchUserResumes(user.id);
      }
      catch (error) {
         alert(error);
      }

   };

   return (
      <div className={styles.userResumeRow}>
         <h2>{resume.title}</h2>
         {/* <p>Created on: {new Date(resume.createdAt).toLocaleDateString()}</p> */}
         <div className={styles.userResumeRowButtons}>
            <button className={styles.editResumeButton}>Edit</button>
            <button
               className={styles.deleteResumeButton}
               onClick={handleDeleteResume}
            >
               Delete
            </button>
         </div>
         {/* Future implementation: Buttons for viewing, editing, and deleting the resume */}
      </div>
   );
};

export default UserResumeRow;