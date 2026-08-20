import React, { useState, useCallback } from "react";
import { FaRegSmile } from "react-icons/fa";

import { ICON_GROUPS } from "@/lib/iconLibrary";

import { setIcon } from "@/helpers/marks";

import useClickOutside from "@/hooks/useClickOutside.js";

import styles from "./TextFormatting.module.css";

const Icons = ({ editor }) => {
  const [showIcons, setShowIcons] = useState(false);

  const preserveEditorSelection = (event) => {
    event.preventDefault();
  };

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
        onMouseDown: preserveEditorSelection,
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

  const closeDropdown = useCallback(() => {
    setShowIcons(false);
  }, []);

  const dropdownRef = useClickOutside(closeDropdown, showIcons);
  return (
    <div>
      <button
        className='buttonMain'
        onMouseDown={preserveEditorSelection}
        onClick={() => setShowIcons(!showIcons)}
      >
        <FaRegSmile />
      </button>
      {showIcons && (
        <div className={styles.iconDropdownContainer} ref={dropdownRef}>
          {iconGroupsToRender}
          {/* Leaving Clear Button for now, but should not be necessary moving forward, as icons have been migrated from marks to inline void elements */}
          {/* <button
            className='buttonMain'
            onMouseDown={preserveEditorSelection}
            onClick={() => clearIcon()}
          >
            Clear
          </button> */}
        </div>
      )}
    </div>
    // <TextFormatButton text='test' />
  );
};

export default Icons;
