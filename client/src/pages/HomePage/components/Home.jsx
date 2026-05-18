import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './Home.module.css'

const Home = () => {

   const user = useSelector(state => state.user)

   return (
      <div className={styles.homePageContainer}>
         <div className={styles.homePageContent}>
            <div className={styles.welcomeDiv}>
               <h2 className={styles.welcomeH1}>Hi {user.firstName || 'there'}.</h2>
               <h3 className={styles.welcomeH2}>Welcome to ActuallyFreeResume.com</h3>
               <Link className={styles.tryDemoButton} to='/demo'>
                  New here?&nbsp; Try out our demo!
               </Link>
            </div>
         </div>
      </div>
   )
};

export default Home;