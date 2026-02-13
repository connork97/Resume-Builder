import React from "react";
import styles from "./AddSection.module.css";

function AddSection({ addSection }) {
  return (
    <button className={styles.addButton} onClick={addSection}>
      + Add Section
    </button>
  );
}

export default AddSection;