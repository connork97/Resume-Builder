import React, { useEffect } from "react";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";

import { useDummyData } from "./utils/useDummyData";

import styles from "./App.module.css";

const App = () => {
  const ROUTE = "http://127.0.0.1:5555";;
  const fetchAPI = async () => {
    try {
      const response = await fetch(ROUTE) + '/';
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  const createResume = async () => {
    try {
      const response = await fetch(`${ROUTE}/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "My New Resume"
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error creating resume:", error);
    }
  };

  const fetchAllResumes = async () => {
    try {
      const response = await fetch(`${ROUTE}/resumes`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching all resumes:", error);
    }
  }

  const fetchFirstResume = async () => {
    try {
      const response = await fetch(`${ROUTE}/resumes/1`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching first resume:", error);
    }
  }


  useEffect(() => {
    // fetchAPI();
    fetchAllResumes();
    // createResume();
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
