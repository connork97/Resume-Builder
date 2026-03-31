import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import styles from './UserResumesDropdown.module.css';

const UserResumesDropdown = () => {

   const user = useSelector((state) => state.user);

   const userResumes = user.resumes.map((resume) => (
      <div className={styles.userResumeDropdownRow}>
         <p key={resume.id} className={styles.userResumeDropdownItem}>
            {resume.title}
         </p>
         <button className={styles.userResumeViewButton}>
            Edit
         </button>
         <button className={styles.userResumeDeleteButton}>
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