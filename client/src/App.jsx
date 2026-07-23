import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { checkApi, checkSession } from "./services/sessionServices";

import NavbarLayout from "./components/Layout/NavbarLayout";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import ResumeEditorPage from "./pages/ResumeEditorPage/ResumeEditorPage";
import UserResumes from "./pages/AccountPage/components/UserResumes.jsx";
import AccountSettings from "./pages/AccountPage/components/AccountSettings.jsx";
import Draggable from "./components/Draggable/Draggable";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const runSiteLaunch = async () => {

      const apiStatus = await checkApi();
      console.log('API STATUS: ', apiStatus);

      const sessionData = await checkSession();
      if (sessionData !== null) {
        dispatch(setUser(sessionData));
      }
    }
    runSiteLaunch();
  }, [dispatch]);


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path='/signup' element={<AuthPage />} />
          <Route path='/login' element={<AuthPage />} />
        </Route>

          <Route path='/account' element={<AccountPage />}>
            <Route path='my-resumes' element={<UserResumes />} />
            <Route path='settings' element={<AccountSettings />} />
          </Route>
        <Route path='/draggable' element={<Draggable />} />

        <Route path='/editor' element={<ResumeEditorPage />} />
        <Route path='/editor/new' element={<ResumeEditorPage />} />
        <Route path='/editor/:resumeId' element={<ResumeEditorPage />} />
        <Route path='/demo' element={<ResumeEditorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
