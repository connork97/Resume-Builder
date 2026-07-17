import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateColumn } from "@/store/resumeSlice.js";

import styles from "../SettingsModal.module.css";

const ColumnSettings = () => {
  const dispatch = useDispatch();

  const activeSectionId = useSelector((state) => state.resume.activeSectionId);
  const section = useSelector(
    (state) => state.resume.sections.byId[activeSectionId],
  );
  const column = useSelector(
    (state) => state.resume.columns.byId[section.columnId],
  );

  const [columnWidthInputValue, setColumnWidthInputValue] = useState(
    column.layout.width.value.replace("%", "") || "auto",
  );
  const [autoWidthInputValue, setAutoWidthInputValue] = useState(
    column.layout.width.auto || false,
  );

  const handleColumnWidthSubmit = (e) => {
    e.preventDefault();
    if (columnWidthInputValue < 0) {
      alert();
    }

    dispatch(
      updateColumn({
        id: column.id,
        changes: {
          layout: {
            width: {
              value: columnWidthInputValue + "%",
              auto: false,
            },
          },
        },
      }),
    );
    setAutoWidthInputValue(false);
  };

  const handleAutoWidthSubmit = () => {
    // e.preventDefault();
    dispatch(
      updateColumn({
        id: column.id,
        changes: {
          layout: {
            width: {
              auto: autoWidthInputValue,
            },
          },
        },
      }),
    );
  };

  useEffect(() => {
    handleAutoWidthSubmit();
  }, [autoWidthInputValue]);

  return (
    <div className={styles.settingsModalWrapper}>
      <h2 className={styles.settingsModalHeader}>
        Column {column.position + 1} Settings:
      </h2>
      <div className="flexRow spaceBetween">
        <form
          className='flexRow'
          onSubmit={handleColumnWidthSubmit}
        >
          <label
            htmlFor="columnWidthInput"
            className={styles.settingsModalLabel}
          >
            <span style={{ verticalAlign: "middle" }}>Width:</span>

            <input
              id="columnWidthInput"
              className="inputMain"
              style={{textAlign: 'left', width: '3.5rem', marginRight: '-1.75rem', padding: '0 0 0 0.5rem',}}

              // className={styles.settingsModalInput}
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={columnWidthInputValue}
              onChange={(e) => setColumnWidthInputValue(e.target.value)}
            />
            <span style={{pointerEvents: 'none'}}>%</span>
          </label>
        </form>
        <form
          className='flexRow'
          onSubmit={handleAutoWidthSubmit}
        >
          <label htmlFor="autoWidthInput" className={styles.settingsModalLabel}>
            AutoWidth:
            <input
              // id="autoWidthInput"
              // className='inputMain'
              type="checkbox"
              checked={autoWidthInputValue}
              onChange={(e) => setAutoWidthInputValue(e.target.checked)}
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default ColumnSettings;
