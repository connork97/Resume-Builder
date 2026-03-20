import React from 'react';

import styles from "./SettingsModal.module.css";

const SettingsModalInput = ({ label, value, handleSetInputValue, handleSetValue, setIsSettingsModalOpen }) => {

   return (
      <div className={styles.settingsModalInputContainerDiv}>
         <div className={styles.settingsModalRow}>
         <p className={styles.settingsModalLabel}>{label}:</p>
         <input
            onKeyDown={(e) => e.key === 'Enter' ? handleSetValue() : null}
            className={styles.settingsModalInput}
            value={value}
            // style={{ width: `${value.length * 2}vh` }}
            onChange={(e) => handleSetInputValue(e.target.value)}
            // onBlur={() => setIsSettingsModalOpen(false)}
            // onLostPointerCapture={() => setIsSettingsModalOpen(false)}
         >
         </input>
         </div>
      </div>
   );
}

export default SettingsModalInput;