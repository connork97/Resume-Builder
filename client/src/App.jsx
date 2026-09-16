import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";
// import { revertToPreviousState } from "./store/resumeSlice";
import { setUser } from "./store/userSlice";
import { checkApi, checkSession } from "./services/sessionServices";
import { getResumeFromApi } from "./services/resumeServices";

import NavbarLayout from "./components/Layout/NavbarLayout";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import ResumeEditorPage from "./pages/ResumeEditorPage/ResumeEditorPage";
import UserResumes from "./pages/AccountPage/components/UserResumes.jsx";
import AccountSettings from "./pages/AccountPage/components/AccountSettings.jsx";
import { editorRegistry } from "./helpers/editorRegistry";
import { getUserResumesFromApi } from "./services/userServices";
import ResumePaper from "./features/ResumeEditor/ResumePaper/ResumePaper";
import ResumeEditor from "./pages/ResumeEditorPage/components/ResumeEditor";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const runSiteLaunch = async () => {
      const apiStatus = await checkApi();
      console.log("API STATUS: ", apiStatus);

      const sessionData = await checkSession();
      if (sessionData !== null) {
        dispatch(setUser(sessionData));
      }
    };
    runSiteLaunch();
  }, []);

//   const user = useSelector((state) => state.user);

//   const [tempResumeId, setTempResumeId] = useState(null);

//   const [tempResumeData, setTempResumeData] = useState({});

//   const fetchResumeById = async (resumeId) => {
//     const normalizedResumeData = await getResumeFromApi(resumeId);
//     if (!normalizedResumeData) {
//       return;
//     }
//     setTempResumeData(normalizedResumeData);
//   };
//   //   const fetchResumeById = useCallback(
//   //     async (resumeId) => {
//   //       const normalizedResumeData = await getResumeFromApi(resumeId);
//   //       if (!normalizedResumeData) {
//   //         return;
//   //       }

//   //       dispatch(setResume(normalizedResumeData));
//   //       dispatch(UndoActionCreators.clearHistory());
//   //     },
//   //     [dispatch],
//   //   );

//   useEffect(() => {
//     if (!tempResumeId) return;
//     fetchResumeById(tempResumeId);
//   }, [tempResumeId]);

//   useEffect(() => {
//     console.log("TEMP RESUME DATA: ", tempResumeData);
//   }, [tempResumeData]);

//   const getResumes = async (userId) => {
//     const userData = await getUserResumesFromApi(userId);
//     console.log(userData.resumes);
//     setTempResumeId(userData.resumes[0]?.id || null);
//   };

//   useEffect(() => {
//     if (!user.id) {
//       return;
//     }
//     getResumes(user.id);
//     // console.log(user)
//   }, [user]);

  // Listener for custom multi-key shortcut: Ctrl + Alt + 1 + 2 + 3
  // (Using Ctrl + Alt avoids native browser tab switching like Ctrl + 1/2/3)

  //   }, [dispatch]);

  //   Used for Checking Editor History Undo/Redo Stack
  //   const activeEditorId = useSelector((state) => state.resume.present.activeEditorId);
  //   const editor = editorRegistry.get(activeEditorId);

  //   useEffect(() => {
  //      if (editor) {
  //       console.log('EDITOR FROM APP: ', editor.history);
  //    }
  //   }, [activeEditorId, editor]);

  return (
    <BrowserRouter>
      {/* {tempResumeData && (
         <ResumeEditor tempResumeId={tempResumeId} styling={{ scale: 0.5}} resumeData={tempResumeData} />
      )} */}
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
        </Route>

        <Route path="/account" element={<AccountPage />}>
          <Route index element={<Navigate to="my-resumes" replace />} />
          <Route path="my-resumes" element={<UserResumes />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        <Route path="/editor" element={<ResumeEditorPage />} />
        <Route path="/editor/new" element={<ResumeEditorPage />} />
        <Route path="/editor/:resumeId" element={<ResumeEditorPage />} />
        <Route path="/demo" element={<ResumeEditorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
