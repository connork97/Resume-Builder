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
      if (!confirm('Are you sure you want to save all changes?')) {
         return;
      };

      try {
         const response = await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userFormData),
         });

         const data = await response.json();

         if (!response.ok) {
            throw data?.error;
         }
         dispatch(updateUser(data));
         alert('Account settings updated successfully.');
      } catch (error) {
         console.error(error);
         alert(error.code + '\n' + error.message || error);
      }
   };

   const formattedDate = (dateString) => {
      if (!dateString) return '';
      const options = {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
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
               Your account was created on {formattedDate(userFormData.createdAt)}
            </span>
            <span className={styles.accountTimeStampsSpan}>
               Your account was last updated on {formattedDate(userFormData.updatedAt)}.
            </span>
            <button
               className={styles.accountSubmitButton}
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