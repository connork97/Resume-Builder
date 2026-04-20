import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setResumeId } from '../../../store/resumeSlice';

import { BASE_URL } from '../../../config';

import styles from '../Account.module.css';

const UserResumeRow = ({ resume, fetchUserResumes }) => {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const user = useSelector(state => state.user)

   const handleEditResume = () => {
      dispatch(setResumeId(resume.id));
      navigate(`/editor/${resume.id}`);
   }

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
            <button
               className={styles.editResumeButton}
               onClick={handleEditResume}
            >
               Edit
            </button>
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