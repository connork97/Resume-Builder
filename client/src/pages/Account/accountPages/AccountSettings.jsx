import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { updateUser } from '../../../store/userSlice';

import { BASE_URL } from '../../../config';

import styles from '../Account.module.css';

const AccountSettings = () => {

   const dispatch = useDispatch();
   const user = useSelector(state => state.user);

   const [userFormData, setUserFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      createdAt: '',
      updatedAt: '',
      // password: '',
      // confirmPassword: ''
   });

   useEffect(() => {
      if (user) {
         setUserFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            createdAt: user.createdAt || '',
            updatedAt: user.updatedAt || '',
            // password: '',
            // confirmPassword: ''
         });
      }
   }, [user]);

   const changeUserFormData = (e) => {
      const { name: field, value } = e.target;
      setUserFormData({ ...userFormData, [field]: value });
   };

   const submitUserAccountSettings = async (e) => {
      e.preventDefault();

      try {
         const response = await fetch(`${BASE_URL}/user/${user.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userFormData),
         });

         const data = await response.json();
         console.log(data);

         if (!response.ok) {
            throw new Error(data?.error?.message || 'Error updating account settings.');
         }

         console.log('Account settings updated successfully:', data);
         dispatch(updateUser(data));
         alert('Account settings updated successfully.');
      } catch (error) {
         console.error(error);
         alert(error.message || 'Error updating account settings. Please try again.');
      }
   };

   return (
      <>
         <h1>Account Settings</h1>
         <p className={styles.userResumeRowsWrapper}>Here you can update your account information, change your password, and manage other account settings.</p>
         <form
            className={styles.accountSettingsForm}
            onSubmit={(e) => submitUserAccountSettings(e)}
         >
            <input
               className={styles.accountSettingsInput}
               type='text'
               name='firstName'
               value={userFormData.firstName}
               placeholder='First Name'
               onChange={changeUserFormData}
            />
            <input
               className={styles.accountSettingsInput}
               type='text'
               name='lastName'
               value={userFormData.lastName}
               placeholder='Last Name'
               onChange={changeUserFormData}
            />
            <input
               className={styles.accountSettingsInput}
               type='email'
               name='email'
               value={userFormData.email}
               placeholder='Email'
               onChange={changeUserFormData}
            />
            <span className={styles.accountTimeStampsSpan}>
               Your account was created on {userFormData.createdAt}
            </span>
            <span className={styles.accountTimeStampsSpan}>
               Your account was last updated on {userFormData.updatedAt}.
            </span>
            <button
               className={styles.submitAccountSettingsButton}
               type='submit'
            >
               Update Account
            </button>
            {/* Future implementation: Password fields for changing password */}
         </form>
         {/* Future implementation: Form for updating account information and changing password */}
      </>
   );
};

export default AccountSettings;