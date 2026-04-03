import React from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import UserResumeRow from './UserResumeRow.jsx';

import styles from '../Account.module.css';

const UserResumes = () => {
   const navigate = useNavigate();

   const user = useSelector(state => state.user);

   const renderResumes = () => {
      if (!user.resumes || user.resumes.length === 0) {
         return (
            <>
               <p>You have not created any resumes yet.</p>
            </>
         );
      }
      
      return user.resumes.map(resume => (
         <UserResumeRow key={resume.id} resume={resume} />
      ));
   }
   
   return (
      <>
         <h1>My Resumes</h1>
         <div className={styles.userResumeRowsWrapper}>
            {renderResumes()}
            <button
               className={styles.accountSubmitButton}
               onClick={() => navigate('/editor/new')}
            >
               Create Resume
            </button>
         </div>
      </>
   );
};

export default UserResumes;