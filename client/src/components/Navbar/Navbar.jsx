import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Outlet, Link, useLocation } from "react-router-dom";

import { useMediaQuery } from "../../hooks/useMediaQuery";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();
  const [screenType, setScreenType] = useState(useMediaQuery());

  useEffect(() => {
    if (screenType !== useMediaQuery()) {
      setScreenType(useMediaQuery());
    }
  }, [screenType]);

  const user = useSelector((state) => state.user);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        {screenType === "desktop" && (
          <Link
            to="/"
            exact="true"
            className={`${styles.navbarLink} ${styles.homeNavLink}`}
          >
            {location.pathname === "/" || location.pathname === "/home"
              ? screenType === "desktop"
                ? "ActuallyFreeResume.com"
                : "Home"
              : "Home"}
          </Link>
        )}

        {!user.id && (
          <div
            className={styles.navbarGroup}
            style={{ margin: screenType !== "desktop" ? "auto" : "initial", width: '100%' }}
          >
            {location.pathname !== "/" && location.pathname !== "/home" && (
              <Link
                to="/"
                exact="true"
                className={`${styles.navbarLink} ${styles.homeNavLink}`}
              >
                Home
              </Link>
            )}

            {!user.id && (
              <Link to="/browse" className={styles.navbarLink}>
                Browse
              </Link>
            )}
            {location.pathname !== "/login" && !user.id && (
              <Link to="/login" exact="true" className={styles.navbarLink}>
                Login
              </Link>
            )}
            {location.pathname !== "/signup" && !user.id && (
              <Link to="/signup" exact="true" className={styles.navbarLink}>
                Sign Up
              </Link>
            )}
          </div>
        )}
        {user.id && (
          <div
            className={styles.navbarGroup}
            style={{ margin: screenType !== "desktop" ? "auto" : "initial", width: '100%' }}
          >
            {screenType !== "desktop" &&
              location.pathname !== "/" &&
              location.pathname !== "/home" && (
                <Link
                  to="/"
                  exact="true"
                  className={`${styles.navbarLink} ${styles.homeNavLink}`}
                >
                  Home
                </Link>
              )}
            {location.pathname !== "/browse" && (
              <Link to="/browse" className={styles.navbarLink}>
                Browse
              </Link>
            )}
            {location.pathname !== "/account" && (
              <Link to="/account" className={styles.navbarLink}>
                Account
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
