import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setResumeId } from '../../../store/resumeSlice';

import { BASE_URL } from '../../../config';

import normalizeResumeFromApi from '../../../utils/normalizeResumeFromApi';

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
            throw data?.error;
         }
         alert(data?.success.code + '\n' + data?.success.message)
         fetchUserResumes(user.id);
      }
      catch (error) {
         console.error(error);
         alert(error.code + '\n' + error.message || error);
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