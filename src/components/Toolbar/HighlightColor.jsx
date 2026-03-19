import React from 'react';

import { getActiveMark, setHighlightColor } from "../Slate/helpers/marks.js";
import { updateResumeStyling, updateSection } from "../../store/resumeSlice.js";

import ToolbarDropdown from "./ToolbarDropdown";

const HighlightColor = ({ editor, selection, dispatch, activeSectionId }) => {

  const [currentEditorHighlightColor, setCurrentEditorHighlightColor] = React.useState("rgba(255, 255, 255, 0.5)");

  React.useEffect(() => {
    if (!editor || !selection) return;

    const currentHighlightColor = getActiveMark(editor, 'highlightColor');
    currentHighlightColor && setCurrentEditorHighlightColor(currentHighlightColor);
  }, [editor, selection])

//   const setNewSectionBackgroundColor = (color) => {
//      if (!activeSectionId) {
//       dispatch(updateResumeStyling({ backgroundColor: color }));
//       return;
//     }
//     dispatch(updateSection({
//       sectionId: activeSectionId,
//       changes: { styling: { backgroundColor: color } }
//     }));
//   };


  const setNewHighlightColor = (newHighlightColor = currentEditorHighlightColor) => {
    if (!editor) {
      window.alert("Please select text to highlight.");
      return;
    }
    setHighlightColor(editor, newHighlightColor);
    setCurrentEditorHighlightColor(newHighlightColor);
  }

  return (
    <ToolbarDropdown
      text="HC"
      handleSetColor={setNewHighlightColor}
    />
  )
}

export default HighlightColor;