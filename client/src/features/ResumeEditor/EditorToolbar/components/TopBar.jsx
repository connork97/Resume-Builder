import React, { useState, useEffect, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";

import { setResume, updateResume } from "@/store/resumeSlice.js";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import {
  getResumeFromApi,
  saveResumeToApi,
  copyResumeToApi,
} from "@/services/resumeServices";

import CurrentlyEditing from "./CurrentlyEditing";
import AddSection from "./AddSection";

import styles from "../Toolbar.module.css";

// const TopBar = forwardRef(function TopBar({  }, ref) {
const TopBar = ({ handlePrint }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId } = useParams();

  const resume = useSelector((state) => state.resume.present);
  const user = useSelector((state) => state.user);

  const fetchResumeById = useCallback(
    async (resumeId) => {
      const normalizedResumeData = await getResumeFromApi(resumeId);
      if (!normalizedResumeData) {
        return;
      }

      dispatch(setResume(normalizedResumeData));
      dispatch(UndoActionCreators.clearHistory());
    },
    [dispatch],
  );

  useEffect(() => {
    if (resumeId) fetchResumeById(resumeId);
  }, [resumeId, fetchResumeById]);

  const saveResume = async () => {
    const resumeIsSaved = await saveResumeToApi(resume);
    if (!resumeIsSaved) {
      return;
    }

    alert("Resume saved successfully!");
  };

  const copyResume = async () => {
    // Implement the logic to copy the resume here
    if (user?.id == null) {
      return alert("You must be logged in to copy the resume.");
    }
    const newResume = await copyResumeToApi(resume.id);
    if (!newResume) {
      return alert("Failed to copy the resume.");
    }
    alert("Resume copied successfully! Happy editing.");
    navigate(`/editor/${newResume.id}`);
  };

  const [resumeTitle, setResumeTitle] = useState(resume.title);

  useEffect(() => {
    // if (!resume) return;
    setResumeTitle(resume?.title);
  }, [resume]);

  const handleSetResumeTitle = (e) => {
    const value = e.currentTarget.innerText.trim();

    setResumeTitle(value);
    dispatch(
      updateResume({
        key: "title",
        changes: value,
      }),
    );
  };

  const isMobile = window.innerWidth <= 768;

  //   const resumeTitleString = !isMobile
  //     ? resumeTitle
  //     : resumeTitle.slice(0, 10) + "...";

  return (
    <div className={styles.topBarContainer}>
      {isMobile && (
        <Link to="/home" data-toolbar-label="Home" className={styles.homeLink}>
          Home
        </Link>
      )}
      <div
        className={`buttonMain ${styles.resumeTitle}`}
        // className="buttonMain"
        contentEditable
        data-toolbar-label="Resume Title"
        suppressContentEditableWarning
        onBlur={handleSetResumeTitle}
      >
        <span className={styles.resumeTitleSpan}>{resumeTitle}</span>
      </div>
      {!isMobile && <CurrentlyEditing />}
      {/* <CurrentlyEditing /> */}
      {/* <AddSection /> */}
      {/* <div className={styles.saveCopyPrintButtonsWrapper}> */}
      {user?.id === resume?.userId ? (
        <button
          data-toolbar-label="Save Resume"
          className="buttonMain"
          onClick={saveResume}
        >
          Save {!isMobile && "Resume"}
        </button>
      ) : (
        <button
          data-toolbar-label="Copy Resume"
          className="buttonMain"
          onClick={copyResume}
        >
          Copy {!isMobile && "Resume"}
        </button>
      )}
      <button
        data-toolbar-label="Print Resume"
        className="buttonMain"
        onClick={handlePrint}
      >
        Print
      </button>
      {/* </div> */}
    </div>
  );
};

export default TopBar;
