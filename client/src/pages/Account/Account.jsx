import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import AccountOutline from './AccountOutline';
import UserResumes from './accountPages/UserResumes';

import styles from './Account.module.css';

const Account = () => {

   const user = useSelector(state => state.user);
   return (
      <div className={styles.accountContainer}>
         <AccountOutline />
         <div className={styles.accountContentWrapper}>
            <Outlet />
         </div>
      </div>
   );
};

export default Account;