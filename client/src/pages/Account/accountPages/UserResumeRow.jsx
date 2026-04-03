import React from 'react';

import styles from '../Account.module.css';

const UserResumeRow = ({ resume }) => {

   return (
      <div className={styles.userResumeRow}>
         <h2>{resume.title}</h2>
         {/* <p>Created on: {new Date(resume.createdAt).toLocaleDateString()}</p> */}
         <div className={styles.userResumeRowButtons}>
            <button>View</button>
            <button>Edit</button>
            <button>Delete</button>
         </div>
         {/* Future implementation: Buttons for viewing, editing, and deleting the resume */}
      </div>
   );
};

export default UserResumeRow;