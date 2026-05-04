import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setResumeId } from '@/store/resumeSlice';

import { BASE_URL } from '@/config';

import normalizeResumeFromApi from '@/utils/normalizeResumeFromApi';

import styles from './Account.module.css';
import { deleteResumeFromApi } from '@/services/resumeServices';

const UserResumeRow = ({ resume, fetchUserResumes }) => {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const user = useSelector(state => state.user)

   const handleEditResume = () => {
      dispatch(setResumeId(resume.id));
      navigate(`/editor/${resume.id}`);
   }

   const handleDeleteResume = async () => {
      if (!confirm(`Are you sure you want to delete resume titled ${resume.title}?`)) {
         return;
      }
      
      const resumeIsDeleted = await deleteResumeFromApi(resume.id);
      if (!resumeIsDeleted) {
         return;
      }
      fetchUserResumes(user.id);
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