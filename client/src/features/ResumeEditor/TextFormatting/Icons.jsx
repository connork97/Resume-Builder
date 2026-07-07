import React, { useState } from "react";
import TextFormatButton from "./shared/TextFormatButton";
import { FaRegSmile } from "react-icons/fa";

import { iconsArr } from "@/lib/iconLibrary";

import styles from "./TextFormatting.module.css";
import { setIcon } from "@/helpers/marks";

const Icons = ({ editor }) => {
  const [showIcons, setShowIcons] = useState(false);

  const addIcon = (iconId) => {
    setIcon(editor, iconId);
  };

  const iconsToRender = iconsArr.map(({ id, Icon }) => {
    return (
      React.createElement(Icon, {
        key: id,
        style: { cursor: "pointer" },
        onClick: () => addIcon(id),
      })
    );
  });
  return (
    <div>
      <TextFormatButton
        text={<FaRegSmile />}
        command={() => setShowIcons(!showIcons)}
      />
      {showIcons && (
        <div className={styles.iconDropdownContainer}>
          <div className={styles.iconDropdownWrapper}>{iconsToRender}</div>
          <TextFormatButton
            text="Clear"
            command={() => setIcon(editor, null)}
          />
        </div>
      )}
    </div>
    // <TextFormatButton text='test' />
  );
};

export default Icons;
