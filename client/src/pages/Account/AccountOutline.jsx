import React from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearUser } from '../../store/userSlice';

import { BASE_URL } from '../../config';

import AccountOutlineRow from './AccountOutlineRow';

import styles from './Account.module.css';

const AccountOutline = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const logUserOut = async () => {
      if (!confirm('Are you sure you want to log out?')) {
         return;
      }
      try {
         const response = await fetch(`${BASE_URL}/logout`, {
            method: 'DELETE',
            credentials: 'include',
         });
         
         const data = await response.json();
         if (!response.ok) {
            throw data?.error;
         }
         dispatch(clearUser());
         confirm('You have been logged out successfully.');
         navigate('/home');
      } catch(error) {
         console.error(error);
         alert(error.code + '\n' + error.message || error);
      }
   };
   return (
      <div className={styles.accountOutlineWrapper}>
         <AccountOutlineRow
            text="Home"
            linkTo="/home"
            styling={{ marginTop: '-5vh', marginBottom: '10vh', fontSize: '3vh' }}
         />
         <AccountOutlineRow
            text="My Resumes"
            linkTo="/account/my-resumes"
         />
         <AccountOutlineRow
            text="Settings"
            linkTo="/account/settings"
         />
         <AccountOutlineRow
            text="Log Out"
            // linkTo="/home"
            clickCommand={logUserOut}
         />
      </div>
   );
};

export default AccountOutline;

// Outline Header
// Personal Information
// My Resumes
// Security
// Account Settings
// Log Out