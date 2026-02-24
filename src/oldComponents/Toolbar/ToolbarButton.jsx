import React from "react";

import styles from "./SectionFormatting/TextFormatting.module.css";

export default function ToolbarButton({
  command,
  active,
  label,
  onClick,
  children,
}) {


  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onClick(command)}
      className={`${styles.button} ${active ? styles.active : ""}`}
      style={{ fontStyle: command, textDecoration: command, fontWeight: `${command !== "bold" && "normal"}`}}
    >
      {children || label}
    </button>
  );
}