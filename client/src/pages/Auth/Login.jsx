import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setUser } from '../../store/userSlice';
import { BASE_URL } from '../../config.js';

import styles from './Auth.module.css';

const Login = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();


   const [userCredentials, setUserCredentials] = useState({
      email: '',
      password: ''
   });

   const [showPassword, setShowPassword] = useState(false);

   const changeUserCredentials = (e) => {
      const { name, value } = e.target;
      setUserCredentials((prevCreds) => ({
         ...prevCreds,
         [name]: value
      }));
   };

   const logUserIn = async (e) => {
      e.preventDefault();
      try {
         const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userCredentials),
         });
         const data = await response.json();
         if (!response.ok) {
            throw data.error;
         }
         console.log(`Welcome back`, data)
         dispatch(setUser(data));
         navigate('/account');
      } catch (error) {
         console.error('Error: ', error)
         window.alert(error.code + '\n' + error.message)
      }
   }

   return (
      <div className={styles.loginContainer}>
         <form
            className={styles.loginForm}
            onSubmit={(e) => logUserIn(e)}
         >
            <label
               htmlFor='email'
               className={styles.loginLabel}
            >
               Email:
               <input
                  id='email'
                  type='email'
                  name='email'
                  className={styles.loginInput}
                  value={userCredentials.email}
                  onChange={(e) => changeUserCredentials(e)}
               />
            </label>
            <label
               htmlFor='password'
               className={styles.loginLabel}
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
                  className={styles.loginInput}
                  value={userCredentials.password}
                  onChange={(e) => changeUserCredentials(e)}
               />
            </label>
            <button
               className={styles.submitButton}
            >
               Log In
            </button>
         </form>
      </div>
   );
};

export default Login;