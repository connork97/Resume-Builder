import React from 'react';

import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import styles from './Navbar.module.css';

const Navbar = () => {

   const location = useLocation();

   const user = useSelector(state => state.user);

   console.log(location.pathname)

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
            {location.pathname !== '/login'
               ?
               <Link
                  to='/login'
                  exact='true'
                  className={styles.navbarLink}
               >
                  Login
               </Link>
               : null}
            {location.pathname !== '/signup'
               ?
               <Link
                  to='/signup'
                  exact='true'
                  className={styles.navbarLink}
               >
                  Sign Up
               </Link>
               : null
            }
            {
               user.id
                  ?
                  <Link
                     to='/account'
                     exact='true'
                     className={styles.navbarLink}
                  >
                     Account
                  </Link>
                  : null
            }
         </div>
      </div>
   );
};

export default Navbar;