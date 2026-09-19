import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Outlet, Link, useLocation } from "react-router-dom";

import { useMediaQuery } from "../../hooks/useMediaQuery";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useMediaQuery() === "mobile";
  const isDesktop = useMediaQuery() === "desktop";

  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const isBrowsePage = location.pathname === "/browse";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isAccountPage = location.pathname === "/account";
  //   const [screenType, setScreenType] = useState(useMediaQuery());

  //   useEffect(() => {
  //     if (screenType !== useMediaQuery()) {
  //       setScreenType(useMediaQuery());
  //     }
  //   }, [screenType]);

  const user = useSelector((state) => state.user);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        {isDesktop && user.id && (
          <>
            <Link
              to="/"
              exact="true"
              className={`${styles.navbarLink} ${styles.homeNavLink}`}
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                }
              }}
            >
              {isHomePage ? "ActuallyFreeResume.com" : "Home"}
            </Link>
            {!isBrowsePage && !isAccountPage ? (
              <div className={styles.navbarGroup}>
                <Link to="/browse" className={styles.navbarLink}>
                  Browse
                </Link>
                <Link to="/account" className={styles.navbarLink}>
                  Account
                </Link>
              </div>
            ) : (
              <>
                {!isBrowsePage && (
                  <Link to="/browse" className={styles.navbarLink}>
                    Browse
                  </Link>
                )}
                {!isAccountPage && (
                  <Link to="/account" className={styles.navbarLink}>
                    Account
                  </Link>
                )}
              </>
            )}
          </>
        )}
        {!isDesktop && user.id && (
          <div className={styles.navbarGroup}>
            {!isHomePage && (
              <Link
                to="/"
                exact="true"
                className={`${styles.navbarLink} ${styles.homeNavLink}`}
                onClick={(e) => {
                  if (isHomePage) {
                    e.preventDefault();
                  }
                }}
              >
                Home
              </Link>
            )}
            {!isBrowsePage && (
              <Link to="/browse" className={styles.navbarLink}>
                Browse
              </Link>
            )}
            {!isAccountPage && (
              <Link to="/account" className={styles.navbarLink}>
                Account
              </Link>
            )}
          </div>
        )}
        {isDesktop && !user.id && (
          <>
            <Link
              to="/"
              exact="true"
              className={`${styles.navbarLink} ${styles.homeNavLink}`}
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                }
              }}
            >
              {isHomePage ? "ActuallyFreeResume.com" : "Home"}
            </Link>
            <div className={styles.navbarGroup}>
              {!isBrowsePage && (
                <Link to="/browse" className={styles.navbarLink}>
                  Browse
                </Link>
              )}
              {!isSignupPage && (
                <Link to="/signup" className={styles.navbarLink}>
                  Sign Up
                </Link>
              )}
              {!isLoginPage && (
                <Link to="/login" className={styles.navbarLink}>
                  Login
                </Link>
              )}
            </div>
          </>
        )}
        {!isDesktop && !user.id && (
          <div className={styles.navbarGroup}>
            {!isHomePage && (
              <Link
                to="/"
                exact="true"
                className={styles.navbarLink}
                onClick={(e) => {
                  if (isHomePage) {
                    e.preventDefault();
                  }
                }}
              >
                Home
              </Link>
            )}
            {!isBrowsePage && (
              <Link to="/browse" className={styles.navbarLink}>
                Browse
              </Link>
            )}
            {!isSignupPage && (
              <Link to="/signup" className={styles.navbarLink}>
                Sign Up
              </Link>
            )}
            {!isLoginPage && (
              <Link to="/login" className={styles.navbarLink}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
