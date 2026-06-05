import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { updateUser } from '@/store/userSlice';

// import styles from './Account.module.css';
import styles from './AccountSettings.module.css';
import { updateUserApi } from '@/services/userServices';
import { formatDateTime } from '@/utils/formatDateTime';

const AccountSettings = () => {

   const dispatch = useDispatch();
   const user = useSelector(state => state.user);

   const [userFormData, setUserFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      createdAt: '',
      updatedAt: '',
   });

   useEffect(() => {
      if (user) {
         setUserFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            createdAt: user.createdAt || '',
            updatedAt: user.updatedAt || '',
         });
      }
   }, [user, setUserFormData]);

   const changeUserFormData = (e) => {
      const { name: field, value } = e.target;
      setUserFormData({ ...userFormData, [field]: value });
   };

   const submitUserAccountSettings = async (e) => {
      e.preventDefault();
      if (!confirm('Are you sure you want to save all changes?')) {
         return;
      };

      const updatedUserData = await updateUserApi(user.id, userFormData);
      if (!updatedUserData) {
         return;
      }
      dispatch(updateUser(updatedUserData));
      alert('Account updated successfully.')
   };

   return (
      <>
         <h1 className={styles.accountSettingsH1}>Account Settings</h1>
         <p className={styles.accountSettingsH2}>Here you can update your account information, change your password, and manage other account settings.</p>
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
               Your account was created on {formatDateTime(userFormData.createdAt)}
            </span>
            <span className={styles.accountTimeStampsSpan}>
               Your account was last updated on {formatDateTime(userFormData.updatedAt)}.
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