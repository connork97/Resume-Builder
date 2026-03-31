import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/userSlice";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";

import { useDummyData } from "./utils/useDummyData";

import styles from "./App.module.css";

const App = () => {
  const dispatch = useDispatch();

  const BASE_URL = "http://127.0.0.1:5555";

  const user = useSelector((state) => state.user);

  const fetchAPI = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  const createGuestUser = async () => {
    const guestData = {
      firstName: 'Guest',
      lastName: 'User',
      username: 'guest',
      email: 'guest@guest.com',
      password: 'password'
    }
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      });
      const userData = await response.json();
      if (userData) {
        console.log('Created Guest User:', userData);
        dispatch(setUser(userData));
      }
    } catch (error) {
      console.error("Error creating guest user:", error);
    }
  };

  const fetchUser = async (userId = 1) => {
    console.log('Fetching user with ID:', userId);
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      const userData = await response.json();
      if (userData) {
        console.log('Setting Current User:', userData);
        dispatch(setUser(userData));
      }
    } catch (error) {
      console.error("Error fetching user, creating Guest profile:");
      createGuestUser();
    }
  }


  useEffect(() => {
    fetchAPI();
    fetchUser();
  }, []);

  // useDummyData();

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      {/* <Outline /> */}
      <Page />
    </div>
  );
};

export default App;
