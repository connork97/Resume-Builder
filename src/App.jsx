import React, { useState } from "react";

// import { createEditor } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react';

import styles from "./App.module.css";

import Toolbar from "./components/Toolbar/Toolbar";
import Outline from "./components/Outline/Outline";
import Page from "./components/Page/Page";

import SlateWrapper from './components/Slate/SlateWrapper.jsx';

import { useSelector } from "react-redux";

const App = () => {

  const resumeStyling = useSelector((state) => state.resume.styling)
  const sections = useSelector((state) => state.resume.sections);

  return (
    <div className={styles.appContainerDiv}>
      <Toolbar />
      <Outline />
      <Page resumeStyling={resumeStyling}>
        {sections.map((section, index) =>{
          return <SlateWrapper key={section.id} section={section} index={index} />
        }
            )}
      </Page>

    </div>
  );
}

export default App;