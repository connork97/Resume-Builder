import React from "react";

import styles from "./App.module.css";

import Toolbar from "./components/Toolbar/Toolbar";
import Page from "./components/Page/Page";
import SectionWrapper from "./components/Sections/SectionWrapper";

import { useSelector } from "react-redux";

const App = () => {

  const sections = useSelector((state) => state.resume.sections);

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      <Page>
        {sections.map((section) => (
          <SectionWrapper key={section.id} {...section} />
        ))}
      </Page>

    </div>
  );
}

export default App;