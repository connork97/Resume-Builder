import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

// import SelectResume from './SelectResume.jsx';

import styles from './Home.module.css'

const Home = () => {

   const user = useSelector(state => state.user)

   return (
      <div className={styles.homePageContainer}>
         <div className={styles.homePageContent}>
            <div className={styles.welcomeDiv}>
               <h1 className={styles.welcomeH1}>Hi {user.firstName || 'there'}.</h1>
               <h2 className={styles.welcomeH2}>Welcome to ActuallyFreeResume.com</h2>
            </div>
            <div className={styles.tryUsDiv}>
               {/* <p className={styles.tryUsP}>New here?</p> */}
               <button className={styles.tryUsButton}>
                  <Link to='/demo' exact='true'>
                     New here?&nbsp; Try out our demo!
                  </Link>
               </button>
            </div>
            {/* <SelectResume /> */}
         </div>
      </div>
   )
};

export default Home;