import React from 'react';

import ColumnSettings from './ColumnSettings/ColumnSettings';
import SectionSettings from './SectionSettings/SectionSettings';

import styles from './SettingsModal.module.css';

const SettingsModal = ({ isSettingsModalOpen, setIsSettingsModalOpen }) => {

   return (
      <>
         <div
            className={styles.settingsModalOverlayDiv}
            styles={isSettingsModalOpen ? { display: 'block' } : { display: 'none' }}
            onClick={() => setIsSettingsModalOpen(false)}
         />
         <div className={styles.settingsModalContainerDiv}>
            <ColumnSettings />
            <SectionSettings setIsSettingsModalOpen={setIsSettingsModalOpen} />
         </div>
      </>
   );
}

export default SettingsModal;