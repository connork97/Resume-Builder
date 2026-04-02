import React, { useState } from 'react';

import styles from './Auth.module.css';

const SignUp = () => {

   // const BASE_URL = 'http://localhost:5555';
   const BASE_URL = "http://localhost:5555";


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
      try {
         const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
         });
         const responseData = await response.json();
         if (!response.ok) {
            throw responseData.error;
         }
         // if (responseData.ok) {
         console.log('Sign Up User Data: ', responseData)
         // }
      } catch (error) {
         console.error('Error: ', error)
      }
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