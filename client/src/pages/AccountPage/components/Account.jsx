import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import AccountOutline from './AccountOutline';

import styles from './Account.module.css';
import { logUserOutOfApi } from '@/services/userServices';
import { clearUser } from '@/store/userSlice';

const Account = () => {

   const location = useLocation();

   const user = useSelector(state => state.user);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleLogUserOut = async () => {
      if (!confirm('Are you sure you want to log out?')) {
         return;
      }
      const userIsLoggedOut = await logUserOutOfApi();
      if (!userIsLoggedOut) {
         window.alert('Error logging user out.')
         return;
      }
      dispatch(clearUser());
      confirm('You have been logged out successfully.');
      navigate('/home');
   };
   return (
      <div className={styles.accountContainer}>
         <div className={styles.navLinksWrapper}>
            <Link
               to='/home'
               className={styles.homeButton}
            >
               Home
            </Link>
         </div>
         <div className={styles.accountContent}>
            <div className={styles.accountTabsWrapper}>
               <div className={styles.accountTab}>
                  <Link
                     className={styles.accountTabLink}
                     to='/account/my-resumes'
                  >
                     My Resumes
                  </Link>
               </div>
               <div className={styles.accountTab}>
                  <Link
                     className={styles.accountTabLink}
                     to='/account/settings'
                  >
                     Settings
                  </Link>
               </div>
               <div className={`${styles.logoutTab}`}>
                  <Link
                     className={styles.accountTabLink}
                     onClick={handleLogUserOut}
                  >
                     Logout
                  </Link>
               </div>
            </div>
            <div className={styles.accountInfoWrapper}>
               {location.pathname === '/account' && (
                  <div className={styles.accountHome}>
                     <h1>Welcome back {user.firstName}.</h1>
                     <h2>Thanks for logging in.</h2>
                  </div>
               )}
               <Outlet />
            </div>
         </div>
      </div>
   );
};

export default Account;