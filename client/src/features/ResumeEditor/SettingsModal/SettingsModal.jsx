import React from 'react';


import styles from './SettingsModal.module.css';

import ColumnSettings from './ColumnSettings/ColumnSettings';
import SectionSettings from './SectionSettings/SectionSettings';

const SettingsModal = ({ section, column, isSettingsModalOpen, setIsSettingsModalOpen }) => {

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