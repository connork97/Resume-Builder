import styles from "../Toolbar.module.css";
import ToolBarButton from "../ToolbarButton";

export default function TextAlign({ formatting }) {
  const { activeFormats, applySectionFormatting } = formatting;

  return (
    <div className={styles.container}>
      <ToolBarButton
        active={activeFormats.textAlign === "left"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applySectionFormatting("textAlign", "left")}
      >
        L
      </ToolBarButton>

      <ToolBarButton
        active={activeFormats.textAlign === "center"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applySectionFormatting("textAlign", "center")}
      >
        C
      </ToolBarButton>

      <ToolBarButton
        active={activeFormats.textAlign === "right"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applySectionFormatting("textAlign", "right")}
      >
        R
      </ToolBarButton>

      <ToolBarButton
        active={activeFormats.textAlign === "justify"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applySectionFormatting("textAlign", "justify")}
      >
        J
      </ToolBarButton>
    </div>
  );
}