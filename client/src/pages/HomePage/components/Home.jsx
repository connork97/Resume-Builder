import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./Home.module.css";

const Home = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className={styles.homePageContainer}>
      <div className={styles.homePageContent} >
        <h2 className={styles.homeH2}>Hi {user.firstName || "there"}.
          Welcome {user.id && " back"} to ActuallyFreeResume.com.

        </h2>
        {/* <p className={styles.homeP}> */}
          {/* Welcome {user.id && " back"} to ActuallyFreeResume.com */}
        {/* </p> */}
        {!user.id && (
          <>
            <p className={styles.homeP}>

              New here?&nbsp; Try out our&nbsp;
            <Link className={styles.homeLink} to="/demo">
              demo
            </Link>
              &nbsp;or&nbsp; 
            <Link className={styles.homeLink} to='/signup'>create an account</Link>
            .
            </p>
          </>
        )}

        {/* <p className={styles.homeP}>New here?</p> */}
        {/* <Link className={styles.tryDemoButton} to='/demo'>
               New here?&nbsp;
               Try out our demo!
            </Link>
            <p className={styles.homeP} style={{margin: '1rem auto'}}>Or</p>
            <Link className={styles.tryDemoButton}>Create an Account</Link> */}
      </div>
    </div>
  );
};

export default Home;
