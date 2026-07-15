import React, { useState } from "react";
import TextFormatButton from "./shared/TextFormatButton";
import { FaRegSmile } from "react-icons/fa";

import { ICON_GROUPS } from "@/lib/iconLibrary";

import { setIcon } from "@/helpers/marks";

import styles from "./TextFormatting.module.css";

const Icons = ({ editor }) => {
  const [showIcons, setShowIcons] = useState(false);

  const addIcon = (iconId) => {
    setIcon(editor, iconId);
    setShowIcons(false);
  };

  const clearIcon = () => {
    setIcon(editor, null);
    setShowIcons(false);
  };

  const iconGroupsToRender = ICON_GROUPS.map(({ label, icons }) => {
    const iconsToRender = Object.entries(icons).map(([id, Icon]) => {
      return React.createElement(Icon, {
        key: id,
        style: { cursor: 'pointer' },
        onClick: () => addIcon(id),
      });
    });

    return (
      <div key={label} className={styles.iconDropdownGroup}>
        <p className={styles.iconDropdownLabel}>{label}</p>
        <div className={styles.iconDropdownWrapper}>{iconsToRender}</div>
      </div>
    );
  });

  return (
    <div>
      <button className='buttonMain' onClick={() => setShowIcons(!showIcons)}><FaRegSmile /></button>
      {/* <TextFormatButton
        text={<FaRegSmile style={{height: '1.25rem'}} />}
        command={() => setShowIcons(!showIcons)}
      /> */}
      {showIcons && (
        <div className={styles.iconDropdownContainer}>
          {iconGroupsToRender}
          <TextFormatButton
            text="Clear"
            command={clearIcon}
          />
        </div>
      )}
    </div>
    // <TextFormatButton text='test' />
  );
};

export default Icons;
