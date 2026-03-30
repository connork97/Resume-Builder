import React, { useEffect } from "react";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";

import { useDummyData } from "./utils/useDummyData";

import styles from "./App.module.css";

const App = () => {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/test")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, [])
  useDummyData();

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      {/* <Outline /> */}
      <Page />
    </div>
  );
}

export default App;