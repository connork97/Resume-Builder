import React from 'react';

import { useSelector } from 'react-redux';

import styles from '../Account.module.css';

const UserResumes = () => {

   const user = useSelector(state => state.user);

   return (
      <div className={styles.userResumesWrapper}>
         <h1>My Resumes</h1>
         <p>Here you can view and manage all of your resumes.</p>
         {/* Future implementation: List of user's resumes with options to view, edit, or delete each resume */}
      </div>
   );
};

export default UserResumes;