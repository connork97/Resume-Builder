import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import styles from './SelectResume.module.css';
import UserResumesDropdown from './UserResumesDropdown.jsx';
import { setUser } from '../../store/userSlice.js';

const SelectResume = () => {

   const BASE_URL = "http://localhost:5555";

   const dispatch = useDispatch();

   const user = useSelector((state) => state.user);

   const [showUserResumes, setShowUserResumes] = useState(false);

   const noResumeMessage = 'It looks like you haven\'t created a resume yet. Start by creating a new resume to see it here!';
   const yesResumeMessage = `You have ${user.resumes.length} resume${user.resumes.length === 1 ? '' : 's'}. Click "View Existing Resumes" to see them or "Create New Resume" to make another one!`

   const createResume = async () => {
      try {
         const response = await fetch(`${BASE_URL}/resumes`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               title: 'Untitled Resume',
               userId: user.id
            })
         });

         if (!response.ok) {
            throw new Error('Failed to create resume');
         }

         const newResume = await response.json();
         dispatch(setUser({ ...user, resumes: [...user.resumes, newResume] }));
         console.log('Created new resume:', newResume);

      } catch (error) {
         console.error('Error creating resume:', error);
      }
   }

   return (
      <div className={styles.createOrChooseContainer}>
         <h1 className={styles.createOrChooseHeader}>Hi {user.firstName || 'there'}.</h1>
         <p className={styles.createOrChooseMessage}>{user.resumes.length > 0 ? yesResumeMessage : noResumeMessage}</p>
         <button
            className={styles.createNewResumeButton}
            onClick={createResume}
         >
            Create New Resume
         </button>
            <div>
               <h1 className={styles.createOrChooseHeader}>OR</h1>
               <button
                  className={styles.createNewResumeButton}
                  onClick={() => setShowUserResumes(!showUserResumes)}
               >
                  View Existing Resumes V
               </button>
            </div>
         {showUserResumes && <UserResumesDropdown />}
      </div>
   )
}

export default SelectResume;