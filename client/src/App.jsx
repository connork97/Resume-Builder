import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { BASE_URL } from "./config.js";

import NavbarLayout from "./components/Layout/NavbarLayout";

import HomePage from "./pages/HomePage/HomePage";
// import Home from "./pages/HomePage/components/Home.jsx";
import AuthPage from "./pages/AuthPage/AuthPage";
// import SignUp from "./pages/AuthPage/components/SignUp.jsx";
// import Login from "./pages/AuthPage/components/Login.jsx";
// import DemoEditor from './oldPages/Demo/DemoEditor.jsx';
// import ResumeEditor from './pages/ResumeEditorPage/components/ResumeEditor.jsx';

import AccountPage from "./pages/AccountPage/AccountPage";
// import Account from "./pages/AccountPage/components/Account.jsx";
import UserResumes from "./pages/AccountPage/components/UserResumes.jsx";
import AccountSettings from "./pages/AccountPage/components/AccountSettings.jsx";

import { useDummyData } from "./utils/useDummyData";
import ResumeEditorPage from "./pages/ResumeEditorPage/ResumeEditorPage";

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
        throw data?.error;
      }
      // console.log('Active session data:', data);
      dispatch(setUser(data));
    } catch (error) {
      console.error(error);
      // alert(error.code + '\n' + error.message || error)
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
          <Route path="/home" exact='true' element={<HomePage />} />
          {/* <Route path="/home" exact='true' element={<Home />} /> */}
          <Route path='/signup' exact='true' element={<AuthPage />} />
          <Route path='/login' exact='true' element={<AuthPage />} />
          {/* <Route path='/signup' exact='true' element={<SignUp />} /> */}
          {/* <Route path='/login' exact='true' element={<Login />} /> */}
        </Route>


        <Route path='/account' element={<AccountPage />}>
          <Route path='my-resumes' element={<UserResumes />} />
          <Route path='settings' element={<AccountSettings />} />
        </Route>
        {/* Routes without Navbar */}
        {/* <Route path='/demo' element={<DemoEditor />} /> */}
        <Route path='/editor' exact='false' element={<ResumeEditorPage />} />
        <Route path='/editor/new' element={<ResumeEditorPage />} />
        <Route path='/editor/:resumeId' element={<ResumeEditorPage />} />
        {/* <Route path='/editor' exact='false' element={<ResumeEditor />} /> */}
        {/* <Route path='/editor/new' element={<ResumeEditor />} /> */}
        {/* <Route path='/editor/:resumeId' element={<ResumeEditor />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
