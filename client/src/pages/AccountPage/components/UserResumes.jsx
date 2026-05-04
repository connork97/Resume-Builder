import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BASE_URL } from '@/config.js';

import UserResumeRow from './UserResumeRow.jsx';

import styles from './Account.module.css';
import { getUserResumesFromApi } from '@/services/userServices.js';

const UserResumes = () => {
   const user = useSelector(state => state.user);
   const navigate = useNavigate();

   const [userResumes, setUserResumes] = useState([]);

   const fetchUserResumes = async (userId) => {
      const userData = await getUserResumesFromApi(userId);
      if (!userData) {
         return;
      }
      setUserResumes(userData.resumes);
   }

   useEffect(() => {
      if (!user.id) return;
      console.log(user.id)
      fetchUserResumes(user.id);
   }, [user.id])


   const renderResumes = () => {
      if (!userResumes || userResumes.length === 0) {
         return (
            <>
               <p>You have not created any resumes yet.</p>
            </>
         );
      }
      
      return userResumes.map(resume => (
         <UserResumeRow key={resume.id} resume={resume} fetchUserResumes={fetchUserResumes} />
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