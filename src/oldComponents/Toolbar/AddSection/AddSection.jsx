import React from "react";
import styles from "./AddSection.module.css";

export default function AddSection({ addSection }) {
  return (
    <button className={styles.button} onClick={addSection}>
      + Section
    </button>
  );
}