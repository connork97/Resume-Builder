import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { deleteColumn, setResume } from "@/store/resumeSlice.js";

import styles from "@/features/ResumeEditor/TextFormatting/TextFormatting.module.css";
import {
  addColumnToApi,
  deleteLastColumnFromApi,
  saveResumeToApi,
} from "@/services/resumeServices.js";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";

const Columns = () => {
  const dispatch = useDispatch();

  const reduxResume = useSelector((state) => state.resume.present);

  const reduxColumns = useSelector((state) => state.resume.present.columns);

  const [columnInputValue, setColumnInputValue] = useState(
    reduxColumns.allIds.length || 0,
  );

  useEffect(() => {
    setColumnInputValue(reduxColumns.allIds.length);
  }, [reduxColumns.allIds]);

  const addColumn = async () => {
   if (reduxColumns.allIds.length >= 10) {
     alert("Resumes cannot have more than 10 columns.");
     return;
   }
    const saved = await saveResumeToApi(reduxResume);
   
    if (!saved) return;
    
    const updatedNormalizedResumeData = await addColumnToApi(reduxResume.id);

    if (!updatedNormalizedResumeData) {
      return;
    }
    dispatch(setResume(updatedNormalizedResumeData));
  };

  const removeLastColumn = async () => {
    const autoSave = false;

    const lastColumnId = reduxColumns.allIds.at(-1);

    if (autoSave) {
      const updatedNormalizedResumeData = await deleteLastColumnFromApi(
        reduxResume.id,
      );
      if (!updatedNormalizedResumeData) {
        return;
      }
    }
    dispatch(deleteColumn(lastColumnId));
  };

  const columnInputLabel = columnInputValue == 1 ? "Column" : "Columns";

  return (
    <div className={styles.toolbarFlexWrapper}>
      <button className="buttonMain" data-toolbar-label="Remove Column" onClick={() => removeLastColumn()}>
        -
      </button>
      <button className="buttonMain" data-toolbar-label="Columns">
        <TfiLayoutColumn3Alt style={{ marginRight: "0.5rem" }} />
        {columnInputValue}
      </button>
      <button className="buttonMain" data-toolbar-label="Add Column" onClick={() => addColumn()}>
        +
      </button>
    </div>
  );
};

export default Columns;
