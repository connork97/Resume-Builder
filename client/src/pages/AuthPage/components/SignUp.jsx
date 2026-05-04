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
      <div className={styles.signUpContainer}>
         <form
            className={styles.signUpForm}
            onSubmit={(e) => createUser(e)}
         >
            <label
               htmlFor='firstName'
               className={styles.signUpLabel}
            >
               First Name:
               <input
                  id='firstName'
                  type='text'
                  name='firstName'
                  className={styles.signUpInput}
                  value={newUser.firstName}
                  onChange={(e) => changeNewUser(e)}
               />
            </label>
            <label
               htmlFor='lastName'
               className={styles.signUpLabel}
            >
               Last Name:
               <input
                  id='lastName'
                  type='text'
                  name='lastName'
                  className={styles.signUpInput}
                  value={newUser.lastName}
                  onChange={(e) => changeNewUser(e)}
               />
            </label>
            <label
               htmlFor='email'
               className={styles.signUpLabel}
            >
               Email:
               <input
                  id='email'
                  type='email'
                  name='email'
                  className={styles.signUpInput}
                  value={newUser.email}
                  onChange={(e) => changeNewUser(e)}
               />
            </label>
            <label
               htmlFor='password'
               className={styles.signUpLabel}
            >
               Password:
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
               <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className={styles.signUpInput}
                  value={newUser.password}
                  onChange={(e) => changeNewUser(e)}
               />
            </label>
            <button className={styles.submitButton}>
               Create Account
            </button>
         </form>
      </div>
   );
};

export default SignUp;