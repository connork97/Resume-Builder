import React from "react";

import styles from "./App.module.css";

import Toolbar from "./components/Toolbar/Toolbar";
import Page from "./components/Page/Page";

export default function App() {

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      <Page />
    </div>
  );
}