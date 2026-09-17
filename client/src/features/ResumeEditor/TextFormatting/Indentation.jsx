import { useDispatch, useSelector } from "react-redux";

import { updateField, updateSection } from "@/store/resumeSlice";
import { BiRightIndent, BiLeftIndent } from "react-icons/bi";

import styles from "./TextFormatting.module.css";

export default function Indentation() {
  const dispatch = useDispatch();

  const activeEditorId = useSelector(
    (state) => state.resume.present.activeEditorId,
  );
  const reduxFields = useSelector((state) => state.resume.present.fields);
  const activeField = reduxFields?.byId[activeEditorId];
  const activeSectionId = useSelector(
    (state) => state.resume.present.activeSectionIds[0],
  );
  const reduxSections = useSelector((state) => state.resume.present.sections);

  const handleFieldIndentationChange = (indentOrOutdent) => {
    if (!activeEditorId) return;
    const isSectionHeading = activeEditorId == activeSectionId;
    let activeTarget = activeField;
    if (isSectionHeading) {
      activeTarget = reduxSections?.byId[activeSectionId];
    }
    let currentMarginLeft = parseFloat(activeTarget.layout?.marginLeft || 0);
    const indentationStep = 0.25;

    if (indentOrOutdent === "indent") {
      currentMarginLeft += indentationStep;
    } else if (indentOrOutdent === "outdent") {
      currentMarginLeft -= indentationStep;
    }

    if (isSectionHeading) {
      dispatch(
        updateSection({
          id: activeTarget.id,
          changes: {
            layout: {
              marginLeft: `${currentMarginLeft}rem`,
            },
          },
        }),
      );
    } else if (!isSectionHeading) {
      dispatch(
        updateField({
          id: activeTarget.id,
          changes: {
            layout: {
              marginLeft: `${currentMarginLeft}rem`,
            },
          },
        }),
      );
    }
  };

  const isIndented = parseFloat(activeField?.layout?.marginLeft || 0) > 0 || parseFloat(reduxSections?.byId[activeSectionId]?.layout?.marginLeft || 0) > 0; 
  const isOutdented = parseFloat(activeField?.layout?.marginLeft) < 0 || parseFloat(reduxSections?.byId[activeSectionId]?.layout?.marginLeft) < 0; 



  return (
    <>
      <button
        data-toolbar-label="Indent"
        aria-label="Indent"
        aria-pressed={isIndented}
      //   aria-pressed={!!editor?.selection && isBlockActive(editor, "Indent")}
        className={`buttonMain ${styles.indentButton}`}
        onClick={() => handleFieldIndentationChange("indent")}
      >
        <BiRightIndent style={{ position: "relative", top: "0.1em" }} />
      </button>
      <button
        data-toolbar-label="Outdent"
        aria-label="Outdent"
        aria-pressed={isOutdented}
        className={`buttonMain ${styles.outdentButton}`}
        onClick={() => handleFieldIndentationChange("outdent")}
      >
        <BiLeftIndent style={{ position: "relative", top: "0.1em" }} />
      </button>
    </>
  );
}
