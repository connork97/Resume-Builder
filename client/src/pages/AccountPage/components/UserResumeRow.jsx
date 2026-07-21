import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setResumeId } from "@/store/resumeSlice";
import { copyResumeToApi, deleteResumeFromApi } from "@/services/resumeServices";

// import styles from './Account.module.css';
import styles from "./UserResumes.module.css";
import { formatDateTime } from "@/utils/formatters";

const UserResumeRow = ({ resume, fetchUserResumes }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const handleEditResume = () => {
    dispatch(setResumeId(resume.id));
    navigate(`/editor/${resume.id}`);
  };

  const handleDeleteResume = async () => {
    if (
      !confirm(`Are you sure you want to delete resume titled ${resume.title}?`)
    ) {
      return;
    }

    const resumeIsDeleted = await deleteResumeFromApi(resume.id);
    if (!resumeIsDeleted) {
      return;
    }
    fetchUserResumes(user.id);
  };

  const handleCopyResume = async () => {
   const copiedResume = copyResumeToApi(resume.id);
   console.log(copiedResume);
   fetchUserResumes(user.id);
  }

  return (
    <div className={styles.userResumeRow}>
      <div className={styles.resumeInfoWrapper}>
        <h2 className={styles.resumeTitle}>{resume.title}</h2>
        <p className={styles.resumeDetails}>Created On: {formatDateTime(resume.createdAt)}</p>
        <p className={styles.resumeDetails}>Last Updated On: {formatDateTime(resume.updatedAt)}</p>
      </div>
      <div className={styles.userResumeRowButtons}>
        <button className={styles.editResumeButton} onClick={handleEditResume}>
          Edit
        </button>
        <button className={styles.editResumeButton} onClick={handleCopyResume}>Make Copy</button>
        <button
          className={styles.deleteResumeButton}
          onClick={handleDeleteResume}
        >
          Delete
        </button>
        {/* Future implementation: Buttons for viewing, editing, and deleting the resume */}
      </div>
    </div>
  );
};

export default UserResumeRow;
