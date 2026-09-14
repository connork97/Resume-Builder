import React from "react";
import { RxColumnSpacing } from "react-icons/rx";

import styles from "../ResumePaper.module.css";

const ColumnResizeHandle = ({ onPointerDown, onKeyDown }) => (
  <button
    type="button"
    className={styles.columnResizeHandle}
    aria-label="Resize adjacent columns"
    onPointerDown={onPointerDown}
    onKeyDown={onKeyDown}
  >
    <RxColumnSpacing aria-hidden="true" />
  </button>
);

export default ColumnResizeHandle;