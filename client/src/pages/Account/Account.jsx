import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import AccountOutline from './AccountOutline';
import UserResumes from './accountPages/UserResumes';

import styles from './Account.module.css';

const Account = () => {

   const location = useLocation();

   const user = useSelector(state => state.user);
   return (
      <div className={styles.accountContainer}>
         <AccountOutline />
         <div className={styles.accountContentWrapper}>
            {location.pathname === '/account' && (
               <div className={styles.accountHome}>
                  <h1>Welcome back {user.firstName}.</h1>
                  <h2>Thanks for logging in.</h2>
               </div>
            )}
            <Outlet />
         </div>
      </div>
   );
};

export default Account;