import React, { useEffect, useRef, useState } from "react";

import ColumnSettings from "./ColumnSettings/ColumnSettings";
import SectionSettings from "./SectionSettings/SectionSettings";

import styles from "./SettingsModal.module.css";

const SettingsModal = ({ isSettingsModalOpen, setIsSettingsModalOpen }) => {
  const modalRef = useRef(null);

  // console.log(modalRef.current)

  let translateY = 0;

  const [modalStylingDict, setModalStylingDict] = useState({});

  useEffect(() => {
    if (!modalRef.current) return;

    const modalRect = modalRef.current.getBoundingClientRect();

    const screenHeight = window.innerHeight;
    const screenMidPoint = screenHeight / 2;

    const elementMidPoint = modalRect.top + modalRect.height / 2;
    const elementBottomPoint = modalRect.bottom;
    const isBelowMiddle = elementMidPoint > screenMidPoint;
    const isOverFlowing = elementBottomPoint > screenHeight;

    let translateYValue = "0";
    if (isOverFlowing) translateYValue = "-90%";

    setModalStylingDict((prevState) => ({
      ...prevState,
      transform: `translateY(${translateYValue})`,
    }));
  }, []);

  return (
    <>
      <div
        className={styles.settingsModalOverlayDiv}
        styles={
          isSettingsModalOpen ? { display: "block" } : { display: "none" }
        }
        onClick={() => setIsSettingsModalOpen(false)}
      />
      <div
        className={styles.settingsModalContainerDiv}
        ref={modalRef}
        style={modalStylingDict}
      >
        <ColumnSettings />
        <SectionSettings setIsSettingsModalOpen={setIsSettingsModalOpen} />
      </div>
    </>
  );
};

export default SettingsModal;
