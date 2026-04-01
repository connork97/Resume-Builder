import React, { useState } from 'react';

import styles from './Auth.module.css';

const Login = () => {
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

   return (
      <div className={styles.loginContainer}>
         <form className={styles.loginForm}>
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