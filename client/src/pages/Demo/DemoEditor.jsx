import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { BASE_URL } from '../../config.js';

import ResumeEditor from '../Editor/ResumeEditor.jsx';

const DemoEditor = () => {

   // const fetchDemoResume = async () => {
   //    try {
   //       const response = await fetch(`${BASE_URL}/resumes/1`)
   //          const demoData = await response.json();
   //          console.log('Demo Data: ', demoData);
   //    } catch (error) {
   //       console.error('Error fetching demo resume data:', error)
   //    }
   // }

   // useEffect(() => {
   //    fetchDemoResume();
   // }, []);

   return (
      <ResumeEditor resumeId='1' />
   );
};

export default DemoEditor;