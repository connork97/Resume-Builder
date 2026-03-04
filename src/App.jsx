import React from "react";

import styles from "./App.module.css";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";
import SectionWrapper from "./components/Sections/SectionWrapper";

import { useSelector } from "react-redux";

const App = () => {

  const resumeStyling = useSelector((state) => state.resume.styling)
  const sections = useSelector((state) => state.resume.sections);

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      <Outline />
      <Page resumeStyling={resumeStyling} >
        {sections.map((section) => (
          <SectionWrapper key={section.id} {...section} />
        ))}
      </Page>

    </div>
  );
}

export default App;