import styles from "./TextFormatting.module.css";

export default function FormattingButton({
  command,
  active,
  label,
  onClick,
  children
}) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onClick(command)}
      className={`${styles.button} ${active ? styles.active : ""}`}
    >
      {children || label}
    </button>
  );
}