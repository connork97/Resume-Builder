import React from 'react';

import styles from "./SettingsModal.module.css";

const SettingsModalInput = ({ label, value, text, handleSetInputValue, handleSetValue, setIsSettingsModalOpen }) => {

   return (
      <div className={styles.settingsModalInputContainerDiv}>
         <div className={styles.settingsModalRow}>
         <p className={styles.settingsModalLabel}>{label}:</p>
         <input
            onKeyDown={(e) => e.key === 'Enter' ? handleSetValue() : null}
            className={styles.settingsModalInput}
            value={value}
            onChange={(e) => handleSetInputValue(e.target.value)}
         >
         </input>
         <span className={styles.settingsModalInputSpan}>{text}</span>
         </div>
      </div>
   );
}

export default SettingsModalInput;