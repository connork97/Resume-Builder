import React from "react";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";

import { useDummyData } from "./utils/useDummyData";

import styles from "./App.module.css";

const App = () => {
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