import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";
// import { revertToPreviousState } from "./store/resumeSlice";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { setUser } from "./store/userSlice";
import { checkApi, checkSession } from "./services/sessionServices";

import NavbarLayout from "./components/Layout/NavbarLayout";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import ResumeEditorPage from "./pages/ResumeEditorPage/ResumeEditorPage";
import UserResumes from "./pages/AccountPage/components/UserResumes.jsx";
import AccountSettings from "./pages/AccountPage/components/AccountSettings.jsx";
import { editorRegistry } from "./helpers/editorRegistry";

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

  // Listener for custom multi-key shortcut: Ctrl + Alt + 1 + 2 + 3
  // (Using Ctrl + Alt avoids native browser tab switching like Ctrl + 1/2/3)
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (e) => {
      pressedKeys.add(e.code);

      const hasCtrl = e.ctrlKey || pressedKeys.has("ControlLeft") || pressedKeys.has("ControlRight");
      const hasAlt = e.altKey || pressedKeys.has("AltLeft") || pressedKeys.has("AltRight");
      const hasUndo = pressedKeys.has("KeyZ")
      //  && (e.ctrlKey || pressedKeys.has("ControlLeft") || pressedKeys.has("ControlRight"));
      const hasRedo = pressedKeys.has("KeyY")
      //  && (e.ctrlKey || pressedKeys.has("ControlLeft") || pressedKeys.has("ControlRight"));
      const has1 = pressedKeys.has("Digit1") || pressedKeys.has("Numpad1");
      const has2 = pressedKeys.has("Digit2") || pressedKeys.has("Numpad2");
      const has3 = pressedKeys.has("Digit3") || pressedKeys.has("Numpad3");

      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        console.log("Shortcut triggered: Ctrl + Z");
        dispatch(UndoActionCreators.undo());
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        console.log("Shortcut triggered: Ctrl + Y");
        dispatch(UndoActionCreators.redo());
      }
      if (hasCtrl && hasAlt && has1 && has2 && has3) {
        e.preventDefault();
        console.log("Shortcut triggered: Ctrl + Alt + 1 + 2 + 3");
      //   dispatch(revertToPreviousState());
      dispatch(UndoActionCreators.undo());
      }
    };

    const handleKeyUp = (e) => {
      pressedKeys.delete(e.code);
    };

    const handleBlur = () => {
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);
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
