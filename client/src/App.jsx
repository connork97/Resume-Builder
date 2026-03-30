import React, { useEffect } from "react";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";

import { useDummyData } from "./utils/useDummyData";

import styles from "./App.module.css";

const App = () => {
  const fetchAPI = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5555/");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  useDummyData();

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      {/* <Outline /> */}
      <Page />
    </div>
  );
};

export default App;
