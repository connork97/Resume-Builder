import React from 'react';

import Toolbar from '../../components/Toolbar/Toolbar.jsx';
import Outline from '../../components/Outline/Outline.jsx';
import Page from '../../components/Page/Page.jsx';

import styles from './Resume.module.css';

const Resume = () => {
   return (
      <div>
         <Toolbar />
         {/* <Outline /> */}
         <Page />
      </div>
   )
};

export default Resume;