import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { BASE_URL } from "./config.js";

import NavbarLayout from "./components/Layout/NavbarLayout";

import Home from "./pages/Home/Home.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import Login from "./pages/Auth/Login.jsx";
import DemoEditor from './pages/Demo/DemoEditor.jsx';
import ResumeEditor from './pages/Editor/ResumeEditor.jsx';

import Account from "./pages/Account/Account.jsx";
import UserResumes from "./pages/Account/accountPages/UserResumes.jsx";
import AccountSettings from "./pages/Account/accountPages/AccountSettings.jsx";

import { useDummyData } from "./utils/useDummyData";

const App = () => {
  const dispatch = useDispatch();

  const checkAPI = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch(`${BASE_URL}/checksession`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw data.error;
      }
      // console.log('Active session data:', data);
      dispatch(setUser(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkAPI();
    checkSession();
  }, []);

  // useDummyData();

  return (
    <BrowserRouter>
      <Routes>

        {/* Routes with Navbar */}
        <Route element={<NavbarLayout />}>
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path="/home" exact='true' element={<Home />} />
          <Route path='/signup' exact='true' element={<SignUp />} />
          <Route path='/login' exact='true' element={<Login />} />
        </Route>


        <Route path='/account' element={<Account />}>
          <Route path='my-resumes' element={<UserResumes />} />
          <Route path='settings' element={<AccountSettings />} />
        </Route>
        {/* Routes without Navbar */}
        <Route path='/demo' element={<DemoEditor />} />
        {/* <Route path='/editor' exact='false' element={<ResumeEditor />} /> */}
        <Route path='/editor/new' element={<ResumeEditor />} />
        <Route path='/editor/:resumeId' element={<ResumeEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
