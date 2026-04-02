import React from 'react';

import { useSelector } from 'react-redux';
import { Outlet, Link, useLocation } from 'react-router-dom';

import styles from './Navbar.module.css';

const Navbar = () => {

   const location = useLocation();

   const user = useSelector(state => state.user);

   return (
      <div className={styles.navbarContainer}>
         <Link
            to='/'
            exact='true'
            className={`${styles.navbarLink} ${styles.homeNavLink}`}
         >
            {location.pathname === '/' || location.pathname === '/home' ? 'ActuallyFreeResume.com' : 'Home'}
         </Link>
         <div className={styles.navbarWrapper}>
            {location.pathname !== '/login' && !user.id
               &&
               <Link
                  to='/login'
                  exact='true'
                  className={styles.navbarLink}
               >
                  Login
               </Link>
            }
            {location.pathname !== '/signup' && !user.id
               &&
               <Link
                  to='/signup'
                  exact='true'
                  className={styles.navbarLink}
               >
                  Sign Up
               </Link>
            }
            {
               user.id
               &&
               <Link
                  to='/account'
                  className={styles.navbarLink}
               >
                  Account
               </Link>
            }
         </div>
      </div>
   );
};

export default Navbar;