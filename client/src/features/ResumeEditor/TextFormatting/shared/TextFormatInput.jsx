import React, { useEffect, useState } from "react";

import styles from "../TextFormatting.module.css";

const TextFormatInput = ({
//   Icon,
  value,
  handleChange,
  commitChange,
  placeholder,
  styling,
}) => {


  return (
    <>
      <input
        onKeyDown={(e) => (e.key === "Enter" ? commitChange() : null)}
        className={styles.textFormatInput}
        style={{...styling}}
      //   style={{...styling, width: `${!styling.width && '3rem'}`}}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || ""}
      ></input>
      {/* <Icon /> */}
    </>
  );
};

export default TextFormatInput;
