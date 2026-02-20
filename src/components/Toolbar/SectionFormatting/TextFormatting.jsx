import { useFormatting } from "../../../hooks/useFormatting";
import FormattingButton from "./FormattingButton";
import styles from "./TextFormatting.module.css";

export default function TextFormatting() {
  const { activeFormats, toggle, saveSelection } = useFormatting();

  return (
    <div className={styles.container} onMouseDown={saveSelection}>
      <FormattingButton
        command="bold"
        label="B"
        active={activeFormats.bold}
        onClick={toggle}
      />

      <FormattingButton
        command="italic"
        label="I"
        active={activeFormats.italic}
        onClick={toggle}
      />

      <FormattingButton
        command="underline"
        label="U"
        active={activeFormats.underline}
        onClick={toggle}
      />

      <FormattingButton
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
      </FormattingButton>
    </div>
  );
}