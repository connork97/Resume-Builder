import React, { useState, useEffect, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { setResume, updateResume } from "@/store/resumeSlice.js";
import { getResumeFromApi, saveResumeToApi } from "@/services/resumeServices";

import CurrentlyEditing from "./CurrentlyEditing";
import AddSection from "./AddSection";

import styles from "../Toolbar.module.css";

// const TopBar = forwardRef(function TopBar({  }, ref) {
const TopBar = ({ handlePrint }) => {
  const dispatch = useDispatch();
  const { resumeId } = useParams();

  const resume = useSelector((state) => state.resume);

  const fetchResumeById = useCallback(
    async (resumeId) => {
      const normalizedResumeData = await getResumeFromApi(resumeId);
      if (!normalizedResumeData) {
        return;
      }

      dispatch(setResume(normalizedResumeData));
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
          suppressContentEditableWarning
          onBlur={handleSetResumeTitle}
          style={{
              width: 'fit-content',
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
        <div className='flexRow'>

        <button className="buttonMain" onClick={saveResume}>
          Save Resume
        </button>
        <button className="buttonMain" onClick={handlePrint}>
          Print
        </button>
        </div>
      </div>
  );
};

export default TopBar;
