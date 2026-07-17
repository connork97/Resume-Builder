import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { deleteColumn, setResume } from "@/store/resumeSlice.js";

import styles from "@/features/ResumeEditor/TextFormatting/TextFormatting.module.css";
import {
  addColumnToApi,
  deleteLastColumnFromApi,
} from "@/services/resumeServices.js";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";

const Columns = () => {
  const dispatch = useDispatch();

  const resume = useSelector((state) => state.resume);

  const columns = useSelector((state) => state.resume.columns);

  // const [columnInputValue, setColumnInputValue] = useState(0);
  const [columnInputValue, setColumnInputValue] = useState(
    columns.allIds.length || 0,
  );

  useEffect(() => {
    setColumnInputValue(columns.allIds.length);
  }, [columns.allIds]);

  const addColumn = async () => {
    const updatedNormalizedResumeData = await addColumnToApi(resume.id);

    if (!updatedNormalizedResumeData) {
      return;
    }
    dispatch(setResume(updatedNormalizedResumeData));
  };

  const removeLastColumn = async () => {
    const autoSave = false;

    const lastColumnId = columns.allIds.at(-1);

    if (autoSave) {
      const updatedNormalizedResumeData = await deleteLastColumnFromApi(
        resume.id,
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
      {/* <label className={styles.toolbarLabelSpan}>
        {columnInputValue + " " + columnInputLabel}:
      </label> */}
      <button className="buttonMain" onClick={() => removeLastColumn()}>
        -
      </button>
      <button className="buttonMain">
        <TfiLayoutColumn3Alt style={{marginRight: '0.5rem'}} />
        {columnInputValue}
      </button>
      <button className="buttonMain" onClick={() => addColumn()}>
        +
      </button>
      {/* <ToolbarInput
            value={columnInputValue}
            handleChange={setColumnInputValue}
            commitChange={() => updateColumns()}
            onBlur={() => updateColumns()}
         /> */}
    </div>
  );
};

export default Columns;
