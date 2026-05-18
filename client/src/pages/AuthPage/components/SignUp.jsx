import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/store/userSlice';

import { BASE_URL } from '@/config.js';

import styles from './Auth.module.css';
import { addUserToApi } from '@/services/userServices';

const SignUp = () => {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [newUser, setNewUser] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
   });

   const [showPassword, setShowPassword] = useState(false);

   const changeNewUser = (e) => {
      const { name, value } = e.target;
      setNewUser((prevUser) => ({
         ...prevUser,
         [name]: value
      }));
   };

   const createUser = async (e) => {
      e.preventDefault();
      const newUserData = await addUserToApi(newUser);
      if (!newUserData) {
         return;
      }

      dispatch(setUser(newUserData));
      navigate('/account');
   }

   return (
      <div className={styles.authContainer}>
         <div className={styles.authContent}>

            <form
               className={styles.authForm}
               onSubmit={(e) => createUser(e)}
            >
               <div className={styles.authItemRow}>
                  <label
                     htmlFor='firstName'
                     className={styles.authLabel}
                  />
                     First Name:
                  <input
                     id='firstName'
                     type='text'
                     name='firstName'
                     className={styles.authInput}
                     value={newUser.firstName}
                     onChange={(e) => changeNewUser(e)}
                  />
               </div>
               <div className={styles.authItemRow}>
                  <label
                     htmlFor='lastName'
                     className={styles.authLabel}
                  >
                     Last Name:
                  </label>
                  <input
                     id='lastName'
                     type='text'
                     name='lastName'
                     className={styles.authInput}
                     value={newUser.lastName}
                     onChange={(e) => changeNewUser(e)}
                  />
               </div>
               <div className={styles.authItemRow}>
                  <label
                     htmlFor='email'
                     className={styles.authLabel}
                  >
                     Email:
                  </label>
                  <input
                     id='email'
                     type='email'
                     name='email'
                     className={styles.authInput}
                     value={newUser.email}
                     onChange={(e) => changeNewUser(e)}
                  />
               </div>
               <div className={styles.authItemRow}>
                  <div className={styles.showPasswordWrapper}>
                     <label
                        htmlFor='password'
                        className={styles.authLabel}
                     >
                        Password:
                     </label>
                     <label
                        htmlFor='showPassword'
                        className={styles.showPasswordLabel}
                     >
                        <input
                           id='showPassword'
                           type="checkbox"
                           className={styles.showPasswordCheckBox}
                           checked={showPassword}
                           onChange={() => setShowPassword(prev => !prev)}
                        />
                        (Show Password)
                     </label>
                  </div>
                  <input
                     id='password'
                     type={showPassword ? 'text' : 'password'}
                     name='password'
                     className={styles.authInput}
                     value={newUser.password}
                     onChange={(e) => changeNewUser(e)}
                  />
               </div>
               <button className={styles.submitButton}>
                  Create Account
               </button>
            </form>
         </div >
      </div >
   );
};

export default SignUp;