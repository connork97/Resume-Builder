import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Navbar.module.css';

const Navbar = () => {
   return (
      <div className={styles.navbarContainer}>
         <Link to='/' exact='true' className={`${styles.navbarLink} ${styles.homeNavLink}`}>Home</Link>
         <div className={styles.navbarWrapper}>
            <Link to='/login' exact='true' className={styles.navbarLink}>Login</Link>
            <Link to='/signup' exact='true' className={styles.navbarLink}>Sign Up</Link>
            <Link to='/account' exact='true' className={styles.navbarLink}>Account</Link>
         </div>
      </div>
   );
};

export default Navbar;