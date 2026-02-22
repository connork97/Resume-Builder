import { useFormatting } from "../../../hooks/useFormatting";
import ToolbarButton from "../ToolbarButton";
import styles from "./TextFormatting.module.css";

export default function TextFormatting() {
  const { activeFormats, toggle, saveSelection } = useFormatting();

  return (
    <div className={styles.container} onMouseDown={saveSelection}>
      <ToolbarButton
        command="bold"
        label="B"
        active={activeFormats.bold}
        onClick={toggle}
      />
      
      <ToolbarButton
        command="italic"
        label="I"
        active={activeFormats.italic}
        onClick={toggle}
      />

      <ToolbarButton
        command="underline"
        label="U"
        active={activeFormats.underline}
        onClick={toggle}
      />

      <ToolbarButton
        command="insertUnorderedList"
        active={activeFormats.unorderedList}
        onClick={toggle}
      >
        {/* Bullet icon */}
        <span className={styles.listIcon}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>

          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </span>
      </ToolbarButton>
    </div>
  );
}