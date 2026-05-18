import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setUser } from '@/store/userSlice';

import styles from './Auth.module.css';
import { logUserInApi } from '@/services/userServices';

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
      const loggedInUserData = await logUserInApi(userCredentials);
      if (!loggedInUserData) {
         return;
      }

      dispatch(setUser(loggedInUserData));
      navigate('/account');
   }

   return (
      <div className={styles.authContainer}>
         <div className={styles.authContent}>
            <form
               className={styles.authForm}
               onSubmit={(e) => logUserIn(e)}
            >
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
                     value={userCredentials.email}
                     onChange={(e) => changeUserCredentials(e)}
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
                     value={userCredentials.password}
                     onChange={(e) => changeUserCredentials(e)}
                  />
               </div>
               <button
                  className={styles.submitButton}
                  >
                  Log In
               </button>
            </form>
         </div>
      </div>
   );
};

export default Login;