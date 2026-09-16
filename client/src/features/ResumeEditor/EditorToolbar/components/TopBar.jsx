import React, { useState, useEffect, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";

import { setResume, updateResume } from "@/store/resumeSlice.js";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import { getResumeFromApi, saveResumeToApi, copyResumeToApi } from "@/services/resumeServices";

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

  return (
    <div className={styles.topBarContainer}>
      <CurrentlyEditing />
      <div
        className="buttonMain"
        contentEditable
        data-toolbar-label="Resume Title"
        suppressContentEditableWarning
        onBlur={handleSetResumeTitle}
        style={{
          width: "fit-content",
          // position: 'relative',
          // left: "0",
          margin: "auto 15% auto 10%",
          //   textAlign: 'center',
          //   translate: '-45% 25%',
        }}
      >
        {resumeTitle}
      </div>
      {/* <AddSection /> */}
      <div className="flexRow">
        {user?.id === resume?.userId ? (
          <button
            data-toolbar-label="Save Resume"
            className="buttonMain"
            onClick={saveResume}
          >
            Save Resume
          </button>
        ) : (
         <button
           data-toolbar-label="Copy Resume"
           className="buttonMain"
           onClick={copyResume}
         >
           Copy Resume
         </button>
        )}
        <button
          data-toolbar-label="Print Resume"
          className="buttonMain"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default TopBar;
