import React from "react";
import styles from "./AddSection.module.css";

function AddSection({ handleAddSection }) {
  return (
    <button className={styles.addButton} onClick={handleAddSection}>
      + Add Section
    </button>
  );
}

export default AddSection;